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
import CopyIcon from '../../assets/svg/copy.svg';
import CloseIcon from '../../assets/svg/close.svg';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';

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
  const [selectedTab, setSelectedTab] = useState(JSON.parse(localStorage.getItem('selectedTab')));
  const [pollIntervals, setPollIntervals] = useState([]);
  const [view, setView] = useState('up_and_down');
  const [aboutPopupVisibility, setAboutPopupVisibility] = useState(false);

  const generateUrl = id => {
    const timestamp = Math.floor(Date.now() / 1000);
    const increment = parseInt(localStorage.getItem('increment'));
    var arr = new ArrayBuffer(8);
    var view = new DataView(arr);
    view.setUint32(0, timestamp, false);
    view.setUint32(4, increment, false);
    const random = arr;
    const encodedTimestamp = zbase32.encode(random);
    let url = `${id}${encodedTimestamp}.interact.sh`;
    return url;
  };

  useEffect(() => {
    if (localStorage.getItem('correlationId') == null) {
      const key = new NodeRSA({ b: 2048 });
      const pub = key.exportKey('pkcs8-public-pem');
      const priv = key.exportKey('pkcs8-private-pem');
      const correlation = xid.next().toString();
      const secret = uuidv4().toString();
      setCorrelationId(correlation);
      setSecretKey(secret);
      localStorage.setItem('theme', 'dark');
      localStorage.setItem('privateKey', priv);
      localStorage.setItem('publicKey', pub);
      localStorage.setItem('correlationId', correlation);
      localStorage.setItem('secretKey', secret);
      localStorage.setItem('data', JSON.stringify([]));
      localStorage.setItem('aesKey', null);
      localStorage.setItem('notes', JSON.stringify([]));

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
      localStorage.setItem('increment', 1);
      let generatedUrl = generateUrl(correlation);
      const lastTabsId = tabs.slice(-1)[0] ? tabs.slice(-1)[0].id : 0;
      setTabs([
        {
          id: lastTabsId + 1,
          correlationId: correlation,
          name: lastTabsId + 1,
          url: generatedUrl,
          note: ''
        }
      ]);
      setSelectedTab({
        id: lastTabsId + 1,
        correlationId: correlation,
        name: lastTabsId + 1,
        url: generatedUrl,
        note: ''
      });
      localStorage.setItem(
        'tabs',
        JSON.stringify([
          {
            id: lastTabsId + 1,
            correlationId: correlation,
            name: lastTabsId + 1,
            url: generatedUrl,
            note: ''
          }
        ])
      );
      localStorage.setItem(
        'selectedTab',
        JSON.stringify({
          id: lastTabsId + 1,
          correlationId: correlation,
          name: lastTabsId + 1,
          url: generatedUrl,
          note: ''
        })
      );

      pollIntervals.map(item => {
        clearInterval(item);
      });

      const interval = setInterval(() => {
        processPolledData();
      }, 4000);
      setPollIntervals([...pollIntervals, interval]);
    }
  }, []);

  const processPolledData = async () => {
    const privateKey = localStorage.getItem('privateKey');
    const aesKey = localStorage.getItem('aesKey');
    const dataFromLocalStorage = JSON.parse(localStorage.getItem('data'));
    const correlation = localStorage.getItem('correlationId');
    const secret = localStorage.getItem('secretKey');

    let polledData = await poll(correlation, secret);
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
      let parsedData = decryptedData.map(item => {
        return JSON.parse(item);
      });
      setData([...data, ...parsedData]);
      localStorage.setItem('data', JSON.stringify([...dataFromLocalStorage, ...parsedData]));
      const selectedTabUrl = selectedTab.url.slice(0, -12);
      let newData = [...data, ...parsedData].filter(item => item['unique-id'] == selectedTabUrl);
      if (filteredData.length !== newData.length) {
        newData = newData.map((item, i) => {
          return { id: i + 1, ...item };
        });
        setFilteredData(newData);
      }
    }
  };

  useEffect(() => {
    pollIntervals.map(item => {
      clearInterval(item);
    });
    if (tabs !== null && tabs.length > 0) {
      const interval = setInterval(() => {
        processPolledData();
      }, 4000);
      setPollIntervals([...pollIntervals, interval]);
      const tabs = JSON.parse(localStorage.getItem('tabs'));
      const selectedTabUrl = selectedTab.url.slice(0, -12);
      let test2 = data.filter(item => item['unique-id'] == selectedTabUrl);
      if (filteredData.length !== test2.length) {
        test2 = test2.map((item, i) => {
          return { id: i + 1, ...item };
        });
        setFilteredData(test2);
      }
    }
  }, [selectedTab]);

  const poll = async (a, b) => {
    let data = await fetch('https://interact.sh' + `/poll?id=${a}&secret=${b}`)
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
    localStorage.setItem('selectedTab', JSON.stringify(value));
    setSelectedInteraction('');
  };
  const handleAddNewTab = () => {
    const newUrl = generateUrl(correlationId);
    const increment = parseInt(localStorage.getItem('increment')) + 1;
    setTabs([
      ...tabs,
      {
        id: increment,
        correlationId: correlationId,
        name: increment,
        url: newUrl,
        note: ''
      }
    ]);
    setSelectedTab({
      id: increment,
      correlationId: correlationId,
      name: increment,
      url: newUrl,
      note: ''
    });
    localStorage.setItem(
      'tabs',
      JSON.stringify([
        ...tabs,
        {
          id: increment,
          correlationId: correlationId,
          name: increment,
          url: newUrl,
          note: ''
        }
      ])
    );
    localStorage.setItem(
      'selectedTab',
      JSON.stringify({
        id: increment,
        correlationId: correlationId,
        name: increment,
        url: newUrl,
        note: ''
      })
    );
    localStorage.setItem('increment', increment);
  };
  const handleNotesVisibility = () => {
    setTimeout(function() {
      document.getElementById('notes_textarea').focus();
    }, 200);
    setIsNotesOpen(!isNotesOpen);
  };

  const handleNoteInputChange = e => {
    const tempTabsList = JSON.parse(localStorage.getItem('tabs'));
    const index = tempTabsList.findIndex(item => {
      return item.id == selectedTab.id;
    });
    tempTabsList[index].note = e.target.value;

    localStorage.setItem('tabs', JSON.stringify(tempTabsList));
    setTabs([...tempTabsList]);
  };

  const handleRowClick = id => {
    setSelectedInteraction(id);
    const reqDetails = filteredData[filteredData.findIndex(item => item.id == id)];
    setSelectedInteractionData(reqDetails);
  };

  const copyDataToClipboard = value => {
    navigator.clipboard.writeText(value);
  };

  const handleDeleteTab = id => {
    let tempTabsList = [...tabs];
    let filteredTempTabsList = tempTabsList.filter(value => {
      return parseInt(value.id) !== parseInt(id);
    });
    let tempTabsData = [...data];
    let filteredTempTabsData = tempTabsData.filter(value => {
      return parseInt(value.id) !== parseInt(id);
    });

    setSelectedTab({ ...filteredTempTabsList[0] });
    localStorage.setItem('selectedTab', JSON.stringify(filteredTempTabsList[0]));
    setTabs([...filteredTempTabsList]);
    localStorage.setItem('tabs', JSON.stringify([...filteredTempTabsList]));
    setData([...filteredTempTabsData]);
    localStorage.setItem('data', JSON.stringify([...filteredTempTabsData]));
  };

  const handleTabRename = e => {
    const tempTabsList = JSON.parse(localStorage.getItem('tabs'));
    const index = tempTabsList.findIndex(item => {
      return item.id == selectedTab.id;
    });
    tempTabsList[index].name = e.target.value;

    localStorage.setItem('tabs', JSON.stringify(tempTabsList));
    setTabs([...tempTabsList]);
  };

  const handleChangeView = value => {
    setView(value);
  };

  const handleAboutPopupVisibility = () => {
    setAboutPopupVisibility(!aboutPopupVisibility);
  };

  const selectedTabsIndex = tabs.findIndex(item => {
    return item.id == selectedTab.id;
  });

  return (
    <ThemeProvider theme={theme === 'dark' ? darkTheme : theme == 'synth' ? synthTheme : blueTheme}>
      <>
        <GlobalStyles />
        <div className={styles.container}>
          {aboutPopupVisibility && (
            <div className={styles.about_popup_wrapper}>
              <div className={styles.about_popup}>
                <div className={styles.about_popup_header}>
                  <span>About</span>
                  <CloseIcon onClick={handleAboutPopupVisibility} />
                </div>
                <div className={styles.about_popup_body}>
                  Interactsh is an Open-Source solution for Out of band Data Extraction, A tool
                  designed to detect bugs that cause external interactions, For example - Blind
                  SQLi, Blind CMDi, SSRF, etc.
                  <br />
                  <br />
                  If you are an IT admin and you are seeing interactions with the Interact.sh server
                  in your logs, then it is likely that someone is testing your applications using
                  our service interact.sh. If you are trying to identify the person responsible for
                  this testing, you should review your web server or applications logs for the time
                  at which these interactions were initiated by your systems.
                  <br />
                  <br />
                  For further details about Interact.sh,{' '}
                  <a href="#" target="__blank">
                    check our documentation and code.
                  </a>
                </div>
              </div>
            </div>
          )}
          <Header
            handleAboutPopupVisibility={handleAboutPopupVisibility}
            theme={theme}
            handleThemeSelection={handleThemeSelection}
          />
          <TabSwitcher
            handleTabButtonClick={handleTabButtonClick}
            selectedTab={selectedTab}
            data={[...tabs]}
            handleAddNewTab={handleAddNewTab}
            copyDataToClipboard={copyDataToClipboard}
            handleDeleteTab={handleDeleteTab}
            handleTabRename={handleTabRename}
            processPolledData={processPolledData}
          />
          <div className={styles.body}>
            <div className={styles.left_section}>
              <div className={`${styles.url_container} secondary_bg`}>
                <div title={selectedTab && selectedTab.url}>{selectedTab && selectedTab.url}</div>
                <CopyIcon onClick={() => copyDataToClipboard(selectedTab.url)} />
              </div>
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
                  {/* <SyntaxHighlighter language="javascript" style={dark}> */}
                  {/* {tabs[selectedTabsIndex].note} */}
                  <textarea
                    id="notes_textarea"
                    placeholder={'Please paste note here max 1200 charachters..'}
                    autoFocus
                    value={tabs[selectedTabsIndex] && tabs[selectedTabsIndex].note}
                    onChange={handleNoteInputChange}
                  ></textarea>
                  {/* </SyntaxHighlighter> */}
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
                    <span
                      className={view == 'request' && styles.__selected_req_res_button}
                      onClick={() => handleChangeView('request')}
                    >
                      Request
                    </span>
                    <span
                      className={view == 'response' && styles.__selected_req_res_button}
                      onClick={() => handleChangeView('response')}
                    >
                      Response
                    </span>
                  </div>
                  <SideBySideIcon
                    style={{ fill: view == 'side_by_side' ? '#ffffff' : '#4a4a4a' }}
                    onClick={() => handleChangeView('side_by_side')}
                  />
                  <UpDownIcon
                    style={{ fill: view == 'up_and_down' ? '#ffffff' : '#4a4a4a' }}
                    onClick={() => handleChangeView('up_and_down')}
                  />
                  <div className={styles.result_info}>
                    From IP address <span>{selectedInteractionData['remote-address']}</span> at{' '}
                    <span>
                      {dateTransform(selectedInteractionData.timestamp, 'yyyy-mm-dd_hh:mm')}
                    </span>
                  </div>
                </div>
                <RequestDetailsWrapper
                  selectedInteractionData={selectedInteractionData}
                  view={view}
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
