import React, { useEffect, useState } from 'react';
import styles from './styles.scss';
import ChevronUpIcon from '../../assets/svg/chevron_up.svg';
import SideBySideIcon from '../../assets/svg/side_by_side.svg';
import UpDownIcon from '../../assets/svg/up_down.svg';
import Header from '../../components/header';
import TabSwitcher from '../../components/tabSwitcher';
import RequestsTableWrapper from './requestsTableWrapper';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from '../../globalStyles';
import { blueTheme, darkTheme, synthTheme } from '../../Themes';
import RequestDetailsWrapper from './requestDetailsWrapper';
import NodeRSA from 'node-rsa';
import { v4 as uuidv4 } from 'uuid';
import xid from 'xid-js';
import crypto from 'crypto';
import zbase32 from 'zbase32';
import dateTransform from '../../components/common/dateTransform';


const HomePage = props => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [correlationId, setCorrelationId] = useState(localStorage.getItem('correlationId'));
  const [secretKey, setSecretKey] = useState(localStorage.getItem('secretKey'));
  const [tabs, setTabs] = useState(JSON.parse(localStorage.getItem('tabs')) || []);
  const [data, setData] = useState(JSON.parse(localStorage.getItem('data')) || []);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedInteraction, setSelectedInteraction] = useState('');
  const [selectedInteractionData, setSelectedInteractionData] = useState({});
  const [selectedTab, setSelectedTab] = useState(1);
  const [pollIntervals, setPollIntervals] = useState([]);

  const generateUrl = id => {
    const tabsListLength = tabs == null ? 0 : tabs.length;
    const timestamp = Math.floor(Date.now() / 1000);
    var arr = new ArrayBuffer(8);
    var view = new DataView(arr);
    view.setUint32(0, timestamp, false);
    view.setUint32(4, tabsListLength + 1, false);
    const random = arr;
    const encodedTimestamp = zbase32.encode(random);
    let url = `${id}${encodedTimestamp}.interact.sh`;
    return url;
  };

  const test = async () => {
    const privateKey = localStorage.getItem('privateKey');
    const aesKey = localStorage.getItem('aesKey');
    const dataFromLocalStorage = JSON.parse(localStorage.getItem('data'));

    let polledData = await poll(correlationId, secretKey);
    let decryptedKey;

    if (aesKey == 'null' && polledData.aes_key) {
      const key = new NodeRSA({ b: 2048 });
      key.setOptions({
        environment: 'browser',
        encryptionScheme: {
          hash: 'sha256'
        }
      });
      key.importKey(privateKey, 'pkcs8-private');
      decryptedKey = key.decrypt(polledData.aes_key, 'base64');
      localStorage.setItem('aesKey', key.decrypt(polledData.aes_key, 'base64'));
    }

    if (polledData.data.length !== 0) {
      let decryptedData = polledData.data.map(item => {
        const aesKey = Buffer.from(localStorage.getItem('aesKey'), 'base64');
        const iv = Buffer.from(item, 'base64').slice(0, 16);
        var decipher = crypto.createDecipheriv('aes-256-cfb', aesKey, iv);
        var mystr = decipher.update(Buffer.from(item, 'base64', 'utf8').slice(16));
        mystr += decipher.final('utf8');
        return mystr;
      });
      let test = decryptedData.map(item => {
        return JSON.parse(item);
      });
      setData([...data, ...test]);
      localStorage.setItem('data', JSON.stringify([...dataFromLocalStorage, ...test]));
      const tabs = JSON.parse(localStorage.getItem('tabs'));
      const selectedTabUrl = tabs[tabs.findIndex(item => item.id == selectedTab)].url.slice(0, -12);
      let test2 = [...data, ...test].filter(item => item['unique-id'] == selectedTabUrl);
      if (filteredData.length !== test2.length) {
        test2 = test2.map((item, i) => {
          return { id: i + 1, ...item };
        });
        setFilteredData(test2);
      }
    }
  };

  function stringToArrayBuffer(string) {
    var len = string.length;
    var buf = new ArrayBuffer(len * 2);
    var bufView = new Uint16Array(buf);
    for (var i = 0, strLen = len; i < strLen; i++) {
      bufView[i] = string.charCodeAt(i);
    }
    return buf;
  }

  useEffect(() => {
    pollIntervals.map(item => {
      clearInterval(item);
    });
    if (tabs !== null && tabs.length > 0) {
      const interval = setInterval(() => {
        test();
      }, 4000);
      setPollIntervals([...pollIntervals, interval]);
      const tabs = JSON.parse(localStorage.getItem('tabs'));
      const selectedTabUrl = tabs[tabs.findIndex(item => item.id == selectedTab)].url.slice(0, -12);
      let test2 = data.filter(item => item['unique-id'] == selectedTabUrl);
      if (filteredData.length !== test2.length) {
        test2 = test2.map((item, i) => {
          return { id: i + 1, ...item };
        });
        setFilteredData(test2);
      }
    }
  }, [selectedTab]);

  useEffect(() => {
    if (localStorage.getItem('correlationId') == null) {
      const key = new NodeRSA({ b: 2048 });
      const pub = key.exportKey('pkcs8-public-pem');
      const priv = key.exportKey('pkcs8-private-pem');
      localStorage.setItem('theme', 'dark');
      localStorage.setItem('privateKey', priv);
      localStorage.setItem('publicKey', pub);
      const correlation = xid.next().toString();
      const secret = uuidv4().toString();
      setCorrelationId(correlation);
      setSecretKey(secret);
      localStorage.setItem('correlationId', correlation);
      localStorage.setItem('secretKey', secret);
      localStorage.setItem('data', JSON.stringify([]));
      localStorage.setItem('aesKey', null);

      let registerFetcherOptions = {
        'public-key': btoa(pub),
        'secret-key': secret,
        'correlation-id': correlation
      };

      let response;

      const getResponse = async () => {
        response = await fetch('https://interact.sh/register', {
          method: 'POST',
          mode: 'no-cors',
          cache: 'no-cache',
          headers: {
            'Content-Type': 'application/json'
          },
          referrerPolicy: 'no-referrer',
          body: JSON.stringify(registerFetcherOptions)
        });
        return response;
      };

      getResponse().then(res => {
        if (res.status !== 0) {
          localStorage.clear();
        }
      });

      const tabsListLength = tabs == null ? 0 : tabs.length;
      setTabs([
        {
          id: tabsListLength + 1,
          correlationId: correlation,
          name: 'First tab',
          url: generateUrl(correlation)
        }
      ]);
      localStorage.setItem(
        'tabs',
        JSON.stringify([
          {
            id: tabsListLength + 1,
            correlationId: correlation,
            name: 'First tab',
            url: generateUrl(correlation)
          }
        ])
      );
    }
  }, []);

  const poll = async (a, b) => {
    let data = await fetch(
      'http://' +
        tabs[
          tabs.findIndex(item => {
            return item.id == selectedTab;
          })
        ].url +
        `/poll?id=${a}&secret=${b}`
    )
      .then(res => {
        return res.json();
      })
      .then(res => {
        return res;
      });
    return data;
  };

  const handleThemeSelection = value => {
    setTheme(value);
    localStorage.setItem('theme', value);
  };
  const handleTabButtonClick = value => {
    setSelectedTab(value);
    setSelectedInteraction('');
  };
  const handleAddNewTab = value => {
    const newUrl = generateUrl(correlationId);
    const tabsListLength = tabs == null ? 0 : tabs.length;
    setTabs([
      ...tabs,
      {
        id: tabsListLength + 1,
        correlationId: correlationId,
        name: 'Second tab',
        url: newUrl
      }
    ]);
    localStorage.setItem(
      'tabs',
      JSON.stringify([
        ...tabs,
        {
          id: tabsListLength + 1,
          correlationId: correlationId,
          name: 'Second tab',
          url: newUrl
        }
      ])
    );
  };
  const handleNotesVisibility = () => {
    setIsNotesOpen(!isNotesOpen);
  };

  const handleRowClick = id => {
    setSelectedInteraction(id);
    const reqDetails = filteredData[filteredData.findIndex(item => item.id == id)];
    setSelectedInteractionData(reqDetails);
  };

  return (
    <ThemeProvider theme={theme === 'dark' ? darkTheme : theme == 'synth' ? synthTheme : blueTheme}>
      <>
        <GlobalStyles />
        <div className={styles.container}>
          <Header theme={theme} handleThemeSelection={handleThemeSelection} />
          <TabSwitcher
            handleTabButtonClick={handleTabButtonClick}
            selectedTab={selectedTab}
            data={[...tabs]}
            handleAddNewTab={handleAddNewTab}
          />
          <div className={styles.body}>
            <div className={styles.left_section}>
              <RequestsTableWrapper
                data={[...filteredData]}
                selectedInteraction={selectedInteraction}
                handleRowClick={handleRowClick}
              />
              <div className={`${styles.notes} secondary_bg`}>
                <div
                  className={styles.detailed_notes}
                  style={{ display: isNotesOpen ? 'flex' : 'none' }}
                >
                  test
                </div>
                <div onClick={handleNotesVisibility} className={styles.notes_footer}>
                  <span>Notes</span>
                  <ChevronUpIcon
                    style={{ transform: isNotesOpen ? 'rotate(180deg)' : 'rotate(0)' }}
                  />
                </div>
              </div>
            </div>
            {selectedInteraction !== '' && (
              <div className={styles.right_section}>
                <div className={styles.result_header}>
                  <div className={styles.req_res_buttons}>
                    <span className={styles.__selected_req_res_button}>Request</span>
                    <span>Response</span>
                  </div>
                  <SideBySideIcon />
                  <UpDownIcon />
                  <div className={styles.result_info}>
                    From IP address <span>{selectedInteractionData['remote-address']}</span> at{' '}
                    <span>
                      {dateTransform(selectedInteractionData.timestamp, 'yyyy-mm-dd_hh:mm')}
                    </span>
                  </div>
                </div>
                <RequestDetailsWrapper
                  selectedInteractionData={selectedInteractionData}
                  selectedInteraction={selectedInteraction}
                />
              </div>
            )}
          </div>
        </div>
      </>
    </ThemeProvider>
  );
};

export default HomePage;
