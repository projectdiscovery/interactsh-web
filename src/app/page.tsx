'use client';

import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { format } from 'date-fns';
import { ThemeProvider } from 'styled-components';

import {
  ChevronUpIcon,
  ClearIcon,
  CloseIcon,
  CopyIcon,
  SideBySideIcon,
  UpDownIcon,
} from '@/components/icons';
import AppLoader from '@/components/appLoader';
import Header from '@/components/header';
import TabSwitcher from '@/components/tabSwitcher';
import { GlobalStyles } from '@/globalStyles';
import {
  generateUrl,
  poll,
  decryptAESKey,
  processData,
  handleResponseExport,
  copyDataToClipboard,
  register,
} from '@/lib';
import { notifyTelegram, notifySlack, notifyDiscord } from '@/lib/notify';
import { Data } from '@/lib/types/data';
import { StoredData } from '@/lib/types/storedData';
import { Tab } from '@/lib/types/tab';
import { View } from '@/lib/types/view';
import { ThemeName, getTheme } from '@/theme';
import { writeStoredData, getStoredData, defaultStoredData, flushStoredData } from '@/lib/localStorage';
import RequestDetailsWrapper from './components/requestDetailsWrapper';
import RequestsTableWrapper from './components/requestsTableWrapper';
import './styles.scss';

const HomePage = () => {
  const [aboutPopupVisibility, setAboutPopupVisibility] = useState<boolean>(false);
  const [filteredData, setFilteredData] = useState<Array<Data>>([]);
  const [isNotesOpen, setIsNotesOpen] = useState<boolean>(false);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [isResetPopupDialogVisible, setIsResetPopupDialogVisible] = useState<boolean>(false);
  const [isNotificationsDialogVisible, setIsNotificationsDialogVisible] = useState<boolean>(false);
  const [loaderAnimationMode, setLoaderAnimationMode] = useState<string>('loading');
  const [selectedInteraction, setSelectedInteraction] = useState<string | null>(null);
  const [selectedInteractionData, setSelectedInteractionData] = useState<Data | null>(null);
  const [storedData, setStoredData] = useState<StoredData>(defaultStoredData);
  const [isCustomHostDialogVisible, setIsCustomHostDialogVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const hasLoadedInitialData = useRef(false);
  const filteredDataRef = useRef<Array<Data>>([]);

  // Initialize stored data on client side
  useEffect(() => {
    setIsClient(true);
    const loadedData = getStoredData();
    setStoredData(loadedData);
    hasLoadedInitialData.current = true;
  }, []);

  const handleResetPopupDialogVisibility = useCallback(() => {
    setIsResetPopupDialogVisible((prev) => !prev);
  }, []);

  const handleNotificationsDialogVisibility = useCallback(() => {
    setIsNotificationsDialogVisible((prev) => !prev);
  }, []);

  const handleCustomHostDialogVisibility = useCallback(() => {
    setIsCustomHostDialogVisible((prev) => !prev);
  }, []);

  const handleThemeSelection = (value: ThemeName) => {
    setStoredData({
      ...storedData,
      theme: value,
    });
  };

  const handleTabButtonClick = (tab: Tab) => {
    setStoredData({
      ...storedData,
      selectedTab: tab,
    });
    setSelectedInteraction(null);
  };

  const handleAddNewTab = () => {
    const { increment, host, correlationId, correlationIdNonceLength } = storedData;
    const newIncrement = increment + 1;
    const { url, uniqueId } = generateUrl(correlationId, correlationIdNonceLength, newIncrement, host);
    const tabData: Tab = {
      'unique-id': uniqueId,
      correlationId,
      name: newIncrement.toString(),
      url,
      note: '',
    };
    setStoredData({
      ...storedData,
      tabs: storedData.tabs.concat([tabData]),
      selectedTab: tabData,
      increment: newIncrement,
    });
    setSelectedInteraction(null);
  };

  const handleNotesVisibility = () => {
    setTimeout(() => {
      document.getElementById('notes_textarea')?.focus();
    }, 200);
    setIsNotesOpen(!isNotesOpen);
  };

  const handleNoteInputChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    const { selectedTab, tabs } = storedData;
    const index = tabs.findIndex((item) => item === selectedTab);
    const currentTab = tabs[index];
    const filteredTabList = tabs.filter((item) => item !== selectedTab);
    filteredTabList.push({ ...currentTab, note: e.target.value });
    setStoredData({
      ...storedData,
      tabs: filteredTabList,
    });
  };

  const handleRowClick = useCallback((id: string) => {
    setSelectedInteraction(id);
    const reqDetails = filteredDataRef.current.find((item) => item.id === id);
    if (reqDetails) {
      setSelectedInteractionData(reqDetails);
    }
  }, []);

  const handleDeleteTab = (tab: Tab) => {
    const { tabs } = storedData;
    const index = tabs.findIndex((value) => value === tab);
    const filteredTempTabsList = tabs.filter((value) => value !== tab);
    const tempTabsData = storedData.data;
    const filteredTempTabsData = tempTabsData.filter(
      (value) => value['unique-id'] !== tab['unique-id']
    );
    setStoredData({
      ...storedData,
      tabs: [...filteredTempTabsList],
      selectedTab: {
        ...filteredTempTabsList[filteredTempTabsList.length <= index ? index - 1 : index],
      },
      data: filteredTempTabsData,
    });
  };

  const handleTabRename: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { selectedTab, tabs } = storedData;
    const updatedTabs = tabs.map((item) =>
      item['unique-id'] === selectedTab['unique-id']
        ? { ...item, name: e.target.value }
        : item
    );
    const updatedTab = updatedTabs.find(
      (item) => item['unique-id'] === selectedTab['unique-id']
    ) || selectedTab;

    setStoredData({
      ...storedData,
      tabs: updatedTabs,
      selectedTab: updatedTab,
    });
  };

  const handleChangeView = (value: View) => {
    setStoredData({
      ...storedData,
      view: value,
    });
  };

  const handleAboutPopupVisibility = () => {
    setAboutPopupVisibility(!aboutPopupVisibility);
  };

  const clearInteractions = () => {
    const { selectedTab, data } = storedData;
    const tempData = data.filter((item) => item['unique-id'] !== selectedTab['unique-id']);
    setStoredData({
      ...storedData,
      data: tempData,
    });
    filteredDataRef.current = [];
    setFilteredData([]);
  };

  const processPolledData = useCallback(async () => {
    const dataFromLocalStorage = getStoredData();
    const { privateKey, aesKey, host, token, data, correlationId, secretKey } = dataFromLocalStorage;

    let decryptedAESKey = aesKey;

    try {
      const pollData = await poll(
        correlationId,
        secretKey,
        host,
        token,
        handleResetPopupDialogVisibility,
        handleCustomHostDialogVisibility
      );

      setIsRegistered(true);
      
      if (pollData?.data?.length > 0 && !pollData.error) {
        if (pollData.aes_key) {
          decryptedAESKey = decryptAESKey(privateKey, pollData.aes_key);
        }
        const processedData = await processData(decryptedAESKey, pollData);

        const formattedString = processedData.map((item: Data) => {
          if (dataFromLocalStorage.responseExport) {
            handleResponseExport(item);
          }

          const telegramMsg = `<i>[${item['full-id']}]</i> Received <i>${item.protocol.toUpperCase()}</i> interaction from <b><a href="https://ipinfo.io/${item['remote-address']}">${item['remote-address']}</a></b> at <i>${format(new Date(item.timestamp), 'yyyy-MM-dd_hh:mm:ss')}</i>`;
          if (dataFromLocalStorage.telegram.enabled) {
            notifyTelegram(telegramMsg, dataFromLocalStorage.telegram.botToken, dataFromLocalStorage.telegram.chatId, 'HTML');
          }
          return {
            slack: `[${item['full-id']}] Received ${item.protocol.toUpperCase()} interaction from \n <https://ipinfo.io/${item['remote-address']}|${item['remote-address']}> at ${format(new Date(item.timestamp), 'yyyy-MM-dd_hh:mm:ss')}`,
            discord: `[${item['full-id']}] Received ${item.protocol.toUpperCase()} interaction from \n [${item['remote-address']}](https://ipinfo.io/${item['remote-address']}) at ${format(new Date(item.timestamp), 'yyyy-MM-dd_hh:mm:ss')}`,
          };
        });

        if (dataFromLocalStorage.slack.enabled) {
          notifySlack(formattedString, dataFromLocalStorage.slack.hookKey, dataFromLocalStorage.slack.channel);
        }
        if (dataFromLocalStorage.discord.enabled) {
          notifyDiscord(formattedString, dataFromLocalStorage.discord.webhook);
        }

        const combinedData: Data[] = data.concat(processedData);

        setStoredData({
          ...dataFromLocalStorage,
          data: combinedData,
          aesKey: decryptedAESKey,
        });

        const newData = combinedData
          .filter((item) => item['unique-id'] === dataFromLocalStorage.selectedTab['unique-id']);
        filteredDataRef.current = newData;
        setFilteredData(newData);
      }
    } catch (error) {
      console.error(error);
      setLoaderAnimationMode('server_error');
      setIsRegistered(false);
    }
  }, [handleResetPopupDialogVisibility, handleCustomHostDialogVisibility]);

  useEffect(() => {
    if (hasLoadedInitialData.current) {
      writeStoredData(storedData);
    }
  }, [storedData]);

  useEffect(() => {
    if (!isClient) return;

    const handleStorageChange = () => {
      setStoredData(getStoredData());
    };

    window.addEventListener('storage', handleStorageChange);
    setIsRegistered(true);

    let registrationIntervalId: number | undefined;

    if (storedData.correlationId === '') {
      setLoaderAnimationMode('loading');
      setIsRegistered(false);
      const timeoutId = setTimeout(() => {
        register(storedData.host, storedData.token, false, false)
          .then((data) => {
            setStoredData(data);
            setIsRegistered(true);
          })
          .catch(() => {
            localStorage.clear();
            setStoredData(defaultStoredData);
            setLoaderAnimationMode('server_error');
            setIsRegistered(false);
          });
      }, 1500);

      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener('storage', handleStorageChange);
        if (registrationIntervalId) {
          window.clearInterval(registrationIntervalId);
        }
      };
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isClient]);

  const pollingIntervalRef = useRef<number | undefined>(undefined);
  const isPageVisibleRef = useRef(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      isPageVisibleRef.current = !document.hidden;
      
      if (document.hidden) {
        if (pollingIntervalRef.current) {
          window.clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = undefined;
        }
        flushStoredData();
      } else if (isClient && storedData.tabs.length > 0) {
        if (!pollingIntervalRef.current) {
          processPolledData(); // Immediate poll on return
          pollingIntervalRef.current = window.setInterval(() => {
            processPolledData();
          }, 4000);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    const handleBeforeUnload = () => {
      flushStoredData();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isClient, storedData.tabs.length, processPolledData]);

  useEffect(() => {
    if (!isClient || storedData.tabs.length === 0) return;

    if (pollingIntervalRef.current) {
      window.clearInterval(pollingIntervalRef.current);
    }

    if (isPageVisibleRef.current) {
      pollingIntervalRef.current = window.setInterval(() => {
        processPolledData();
      }, 4000);
    }

    const tempFilteredData = storedData.data
      .filter((item) => item['unique-id'] === storedData.selectedTab['unique-id']);
    filteredDataRef.current = tempFilteredData;
    setFilteredData(tempFilteredData);

    return () => {
      if (pollingIntervalRef.current) {
        window.clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = undefined;
      }
    };
  }, [storedData.selectedTab, isClient, processPolledData]);

  const selectedTabsIndex = storedData.tabs.findIndex((item) =>
    item === storedData.selectedTab
  );

  const theme = useMemo(() => getTheme(storedData.theme), [storedData.theme]);

  if (!isClient) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles theme={theme} />
      <div className="main">
        <AppLoader isRegistered={isRegistered} mode={loaderAnimationMode} />
        {aboutPopupVisibility && (
          <div className="about_popup_wrapper">
            <div className="about_popup">
              <div className="about_popup_header">
                <span>About</span>
                <CloseIcon style={{ width: 14, cursor: 'pointer' }} onClick={handleAboutPopupVisibility} />
              </div>
              <div className="about_popup_body">
                Interactsh is an Open-Source solution for Out of band Data Extraction, A tool
                designed to detect bugs that cause external interactions, For example - Blind SQLi,
                Blind CMDi, SSRF, etc.
                <br />
                <br />
                If you find communications or exchanges with the Interactsh.com server in your logs, it
                is possible that someone has been testing your applications using our hosted
                service,
                <a href="https://app.interactsh.com" target="_blank" rel="noopener noreferrer">
                  {' app.interactsh.com '}
                </a>
                You should review the time when these interactions were initiated to identify the
                person responsible for this testing.
                <br />
                <br />
                For further details about Interactsh.com,
                <a href="https://github.com/projectdiscovery/interactsh" target="_blank" rel="noopener noreferrer">
                  {' checkout opensource code.'}
                </a>
              </div>
            </div>
          </div>
        )}
        <Header
          handleAboutPopupVisibility={handleAboutPopupVisibility}
          theme={storedData.theme}
          host={storedData.host}
          handleThemeSelection={handleThemeSelection}
          isResetPopupDialogVisible={isResetPopupDialogVisible}
          isNotificationsDialogVisible={isNotificationsDialogVisible}
          handleResetPopupDialogVisibility={handleResetPopupDialogVisibility}
          handleNotificationsDialogVisibility={handleNotificationsDialogVisibility}
          isCustomHostDialogVisible={isCustomHostDialogVisible}
          handleCustomHostDialogVisibility={handleCustomHostDialogVisibility}
        />
        <TabSwitcher
          handleTabButtonClick={handleTabButtonClick}
          selectedTab={storedData.selectedTab}
          data={storedData.tabs}
          handleAddNewTab={handleAddNewTab}
          handleDeleteTab={handleDeleteTab}
          handleTabRename={handleTabRename}
          processPolledData={processPolledData}
        />
        <div className="body">
          <div className="left_section">
            <div className="url_container secondary_bg">
              <div title={storedData.selectedTab && storedData.selectedTab.url}>
                {storedData.selectedTab && storedData.selectedTab.url}
              </div>
              <CopyIcon
                onClick={() => copyDataToClipboard(storedData.selectedTab.url)}
                style={{ cursor: 'pointer' }}
              />
              <div className="vertical_bar" />
              <ClearIcon
                className={
                  filteredData && filteredData.length <= 0 ? 'clear_button__disabled' : undefined
                }
                onClick={clearInteractions}
                style={{ cursor: 'pointer' }}
              />
            </div>
            <RequestsTableWrapper
              data={filteredData}
              selectedInteraction={selectedInteraction || ''}
              handleRowClick={handleRowClick}
              filter={storedData.filter}
            />
            <div className="notes light_bg">
              <div className="detailed_notes" style={{ display: isNotesOpen ? 'flex' : 'none' }}>
                <textarea
                  id="notes_textarea"
                  className="light_bg"
                  placeholder="You can paste your notes here (max 1200 characters)"
                  value={storedData.tabs[selectedTabsIndex] && storedData.tabs[selectedTabsIndex].note}
                  onChange={handleNoteInputChange}
                />
              </div>
              <button type="button" onClick={handleNotesVisibility} className="notes_footer">
                <span>Notes</span>
                <ChevronUpIcon
                  style={{
                    transform: isNotesOpen ? 'rotate(180deg)' : 'rotate(0)',
                  }}
                />
              </button>
            </div>
          </div>
          {selectedInteraction !== null && selectedInteractionData !== null && (
            <div className="right_section">
              <div className="result_header">
                {selectedInteractionData.protocol !== 'smtp' && (
                  <>
                    <div className="req_res_buttons">
                      <button
                        type="button"
                        className={
                          storedData.view === 'request'
                            ? '__selected_req_res_button'
                            : undefined
                        }
                        onClick={() => handleChangeView('request')}
                      >
                        Request
                      </button>
                      <button
                        type="button"
                        className={
                          storedData.view === 'response'
                            ? '__selected_req_res_button'
                            : undefined
                        }
                        onClick={() => handleChangeView('response')}
                      >
                        Response
                      </button>
                    </div>
                    <SideBySideIcon
                      style={{
                        fill: storedData.view === 'side_by_side' ? '#ffffff' : '#4a4a4a',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleChangeView('side_by_side')}
                    />
                    <UpDownIcon
                      style={{
                        fill: storedData.view === 'up_and_down' ? '#ffffff' : '#4a4a4a',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleChangeView('up_and_down')}
                    />
                  </>
                )}
                <div className="result_info">
                  From IP address
                  <span>
                    :{' '}
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`https://ipinfo.io/${selectedInteractionData['remote-address']}`}
                    >
                      {selectedInteractionData['remote-address']}
                    </a>
                  </span>
                  {' at '}
                  <span>{format(new Date(selectedInteractionData.timestamp), 'yyyy-MM-dd_hh:mm')}</span>
                </div>
              </div>
              <RequestDetailsWrapper
                selectedInteractionData={selectedInteractionData}
                view={storedData.view}
              />
            </div>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default HomePage;

