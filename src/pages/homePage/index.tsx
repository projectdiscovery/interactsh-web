/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";

import format from "date-fns/format";
// import { pipe } from "fp-ts/function";
// import * as IOE from "fp-ts/IOEither";
import NodeRSA from "node-rsa";
import { ThemeProvider } from "styled-components";
import { v4 as uuidv4 } from "uuid";
import xid from "xid-js";

import "./styles.scss";
import { ReactComponent as ChevronUpIcon } from "assets/svg/chevron_up.svg";
import { ReactComponent as ClearIcon } from "assets/svg/clear.svg";
import { ReactComponent as CloseIcon } from "assets/svg/close.svg";
import { ReactComponent as CopyIcon } from "assets/svg/copy.svg";
import { ReactComponent as SideBySideIcon } from "assets/svg/side_by_side.svg";
import { ReactComponent as UpDownIcon } from "assets/svg/up_down.svg";
import { GlobalStyles } from "globalStyles";
import {
  generateUrl,
  poll,
  decryptAESKey,
  processData,
  register,
  copyDataToClipboard,
  clearIntervals,
  deregister,
} from "lib";
import Tab from "lib/types/tab";
import View from "lib/types/view";
import { ThemeName, getTheme } from "theme";

import Header from "../../components/header";
import TabSwitcher from "../../components/tabSwitcher";
import {
  writeStoredData,
  getStoredData,
  StoredData,
  Data,
  defaultStoredData,
} from "../../lib/localStorage";
import RequestDetailsWrapper from "./requestDetailsWrapper";
import RequestsTableWrapper from "./requestsTableWrapper";

const HomePage = () => {
  const [storedData, setStoredData] = useState<StoredData>(getStoredData());
  const [isNotesOpen, setIsNotesOpen] = useState<boolean>(false);
  const [filteredData, setFilteredData] = useState<Array<Data>>([]);
  const [selectedInteraction, setSelectedInteraction] = useState<string | null>(null);
  const [selectedInteractionData, setSelectedInteractionData] = useState<Data | null>(null);
  const [aboutPopupVisibility, setAboutPopupVisibility] = useState<boolean>(false);

  const processPolledData = () => {
    const dataFromLocalStorage = getStoredData();
    const { privateKey, aesKey, host, token, data, correlationId, secretKey } =
      dataFromLocalStorage;

    let decryptedAESKey = aesKey;

    poll(correlationId, secretKey, host, token)
      .then((pollData) => {
        if (pollData.data.length !== 0) {
          if (aesKey === "" && pollData.aes_key) {
            decryptedAESKey = decryptAESKey(privateKey, pollData.aes_key);
          }
          const processedData = processData(decryptedAESKey, pollData);
          const combinedData: Data[] = data.concat(processedData);

          setStoredData({
            ...dataFromLocalStorage,
            data: combinedData,
            aesKey: decryptedAESKey,
          });
          writeStoredData({
            ...dataFromLocalStorage,
            data: combinedData,
            aesKey: decryptedAESKey,
          });

          const newData = combinedData
            .filter((item) => item["unique-id"] === dataFromLocalStorage.selectedTab["unique-id"])
            .map((item) => item);
          setFilteredData([...newData]);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    writeStoredData(storedData);
  }, [storedData]);

  // const [storedData, setStoredData] = useState<StoredData>(
  //   pipe(
  //     getStoredData("app", StoredData.type.asDecoder()),
  //     IOE.match(
  //       () => defaultStoredData,
  //       (d) => d
  //     )
  //   )()
  // );

  useEffect(() => {
    if (storedData.correlationId === "") {
      const key = new NodeRSA({ b: 2048 });
      const pub = key.exportKey("pkcs8-public-pem");
      const priv = key.exportKey("pkcs8-private-pem");
      const correlationId = xid.next();
      const secret = uuidv4().toString();
      register(pub, secret, correlationId, storedData.host)
        .then(() => {
          const { url, uniqueId } = generateUrl(correlationId, 1, storedData.host);
          const tabData: Tab[] = [
            {
              "unique-id": uniqueId,
              correlationId,
              name: (1).toString(),
              url,
              note: "",
            },
          ];
          setStoredData({
            ...defaultStoredData,
            privateKey: priv,
            publicKey: pub,
            correlationId,
            secretKey: secret,
            view: "up_and_down",
            host: "interact.sh",
            increment: 1,
            tabs: tabData,
            selectedTab: tabData[0],
          });
          writeStoredData({
            ...defaultStoredData,
            privateKey: priv,
            publicKey: pub,
            correlationId,
            secretKey: secret,
            increment: 1,
            tabs: tabData,
            selectedTab: tabData[0],
          });
          // processPolledData();
          clearIntervals();
          window.setInterval(() => {
            processPolledData();
          }, 4000);
        })
        .catch(() => {
          localStorage.clear();
          setStoredData(defaultStoredData);
        });
    }
  }, []);

  // // Recalculate data when a tab is selected
  useEffect(() => {
    if (storedData.tabs.length > 0) {
      clearIntervals();
      window.setInterval(() => {
        processPolledData();
      }, 4000);
      const tempFilteredData = storedData.data
        .filter((item) => item["unique-id"] === storedData.selectedTab["unique-id"])
        .map((item) => item);
      setFilteredData(tempFilteredData);
    }
  }, [storedData.selectedTab]);

  // "Switch theme" function
  const handleThemeSelection = (value: ThemeName) => {
    setStoredData({
      ...storedData,
      theme: value,
    });
    writeStoredData({
      ...storedData,
      theme: value,
    });
  };

  // "Select a tab" function
  const handleTabButtonClick = (tab: Tab) => {
    setStoredData({
      ...storedData,
      selectedTab: tab,
    });
    writeStoredData({
      ...storedData,
      selectedTab: tab,
    });
    setSelectedInteraction(null);
  };

  // " Add new tab" function
  const handleAddNewTab = () => {
    const { increment, host, correlationId } = storedData;
    const newIncrement = increment + 1;
    const { url, uniqueId } = generateUrl(correlationId, newIncrement, host);
    const tabData: Tab = {
      "unique-id": uniqueId,
      correlationId,
      name: newIncrement.toString(),
      url,
      note: "",
    };
    setStoredData({
      ...storedData,
      tabs: storedData.tabs.concat([tabData]),
      selectedTab: tabData,
      increment: newIncrement,
    });
    writeStoredData({
      ...storedData,
      tabs: storedData.tabs.concat([tabData]),
      selectedTab: tabData,
      increment: newIncrement,
    });
  };

  // "Show or hide notes" function
  const handleNotesVisibility = () => {
    setTimeout(() => {
      document.getElementById("notes_textarea")?.focus();
    }, 200);
    setIsNotesOpen(!isNotesOpen);
  };

  // "Notes input change handler" function
  const handleNoteInputChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    const { selectedTab, tabs } = storedData;
    const index = tabs.findIndex((item) => item["unique-id"] === selectedTab["unique-id"]);
    const currentTab = tabs[index];
    const filteredTabList = tabs.filter((item) => item["unique-id"] !== selectedTab["unique-id"]);
    filteredTabList.push({ ...currentTab, note: e.target.value });
    setStoredData({
      ...storedData,
      tabs: filteredTabList,
    });
    writeStoredData({
      ...storedData,
      tabs: filteredTabList,
    });
  };

  // "Selecting a specific interaction" function
  const handleRowClick = (id: string) => {
    setSelectedInteraction(id);
    const reqDetails =
      filteredData && filteredData[filteredData.findIndex((item) => item.id === id)];
    setSelectedInteractionData(reqDetails);
  };

  // "Deleting a tab" function
  const handleDeleteTab = (id: string) => {
    const { tabs } = storedData;
    const filteredTempTabsList = tabs.filter((value) => value["unique-id"] !== id);
    const tempTabsData = storedData.data;
    const filteredTempTabsData = tempTabsData.filter((value) => value["unique-id"] !== id);
    setStoredData({
      ...storedData,
      tabs: [...filteredTempTabsList],
      selectedTab: { ...filteredTempTabsList[0] },
      data: filteredTempTabsData,
    });
    writeStoredData({
      ...storedData,
      tabs: [...filteredTempTabsList],
      selectedTab: { ...filteredTempTabsList[0] },
      data: filteredTempTabsData,
    });
  };

  // "Renaming a tab" function
  const handleTabRename: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const tempTabsList = storedData.tabs;
    const index = tempTabsList.findIndex(
      (item) => item["unique-id"] === storedData.selectedTab["unique-id"]
    );
    const filteredTabList = tempTabsList.filter(
      (item) => item["unique-id"] !== storedData.selectedTab["unique-id"]
    );
    const tempTab = { ...tempTabsList[index], name: e.target.value };

    setStoredData({
      ...storedData,
      tabs: filteredTabList.concat(tempTab),
    });
    writeStoredData({
      ...storedData,
      tabs: filteredTabList.concat(tempTab),
    });
  };

  // "View selector" function
  const handleChangeView = (value: View) => {
    setStoredData({
      ...storedData,
      view: value,
    });
    writeStoredData({
      ...storedData,
      view: value,
    });
  };

  // "Show or hide about popup" function
  const handleAboutPopupVisibility = () => {
    setAboutPopupVisibility(!aboutPopupVisibility);
  };

  // "Clear interactions of a tab" function
  const clearInteractions = () => {
    const { selectedTab, data } = storedData;
    const tempData = data.filter((item) => item["unique-id"] !== selectedTab["unique-id"]);
    setStoredData({
      ...storedData,
      data: tempData,
    });
    writeStoredData({
      ...storedData,
      data: tempData,
    });
    setFilteredData([]);
  };

  const handleReset = () => {
    // deregister(storedData.secretKey, storedData.correlationId, storedData.host).then(() => {
    //   localStorage.clear();
    //   window.location.reload();
    // });

    const key = new NodeRSA({ b: 2048 });
    const pub = key.exportKey("pkcs8-public-pem");
    const priv = key.exportKey("pkcs8-private-pem");
    const correlation = xid.next().toString();
    const secret = uuidv4().toString();

    register(pub, secret, correlation, storedData.host, storedData.token)
      .then(() => {
        deregister(storedData.secretKey, storedData.correlationId, storedData.host).then(() => {
          window.location.reload();
        });
        localStorage.clear();
        const { url, uniqueId } = generateUrl(correlation, 1, storedData.host);
        const tabData: Tab[] = [
          {
            "unique-id": uniqueId,
            correlationId: correlation,
            name: (1).toString(),
            url,
            note: "",
          },
        ];
        writeStoredData({
          ...defaultStoredData,
          privateKey: priv,
          publicKey: pub,
          correlationId: correlation,
          secretKey: secret,
          increment: 1,
          host: storedData.host,
          token: storedData.token,
          tabs: tabData,
          selectedTab: tabData[0],
        });
        clearIntervals();
      })
      .catch(() => {});
  };

  const selectedTabsIndex = storedData.tabs.findIndex(
    (item) => item["unique-id"] === storedData.selectedTab["unique-id"]
  );

  return (
    <ThemeProvider theme={getTheme(storedData.theme)}>
      <GlobalStyles />
      <div className="main">
        {aboutPopupVisibility && (
          <div className="about_popup_wrapper">
            <div className="about_popup">
              <div className="about_popup_header">
                <span>About</span>
                <CloseIcon style={{ width: 14 }} onClick={handleAboutPopupVisibility} />
              </div>
              <div className="about_popup_body">
                Interactsh is an Open-Source solution for Out of band Data Extraction, A tool
                designed to detect bugs that cause external interactions, For example - Blind SQLi,
                Blind CMDi, SSRF, etc.
                <br />
                <br />
                If you find communications or exchanges with the Interact.sh server in your logs, it
                is possible that someone has been testing your applications using our hosted
                service,
                <a href="https://interact.projectdiscovery.io" target="__blank">
                  {` interact.projectdiscovery.io `}
                </a>
                You should review the time when these interactions were initiated to identify the
                person responsible for this testing.
                <br />
                <br />
                For further details about Interact.sh,
                <a href="https://github.com/projectdiscovery/interactsh" target="__blank">
                  {` checkout opensource code.`}
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
          handleReset={handleReset}
        />
        <TabSwitcher
          handleTabButtonClick={handleTabButtonClick}
          selectedTab={storedData.selectedTab}
          data={[...storedData.tabs]}
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
                style={{ width: 13 }}
                onClick={() => copyDataToClipboard(storedData.selectedTab.url)}
              />
              <div className="vertical_bar" />
              <ClearIcon
                className={
                  filteredData && filteredData.length <= 0 ? "clear_button__disabled" : undefined
                }
                onClick={clearInteractions}
              />
            </div>
            <RequestsTableWrapper
              data={[...filteredData]}
              selectedInteraction={selectedInteraction as any}
              handleRowClick={handleRowClick}
              filter={storedData.filter}
            />
            <div className="notes secondary_bg">
              <div className="detailed_notes" style={{ display: isNotesOpen ? "flex" : "none" }}>
                {/* <SyntaxHighlighter language="javascript" style={dark}> */}
                {/* {tabs[selectedTabsIndex].note} */}
                <textarea
                  id="notes_textarea"
                  placeholder="Please paste note here max 1200 charachters.."
                  value={
                    storedData.tabs[selectedTabsIndex] && storedData.tabs[selectedTabsIndex].note
                  }
                  onChange={handleNoteInputChange}
                />
                {/* </SyntaxHighlighter> */}
              </div>
              <button type="button" onClick={handleNotesVisibility} className="notes_footer">
                <span>Notes</span>
                <ChevronUpIcon
                  style={{
                    transform: isNotesOpen ? "rotate(180deg)" : "rotate(0)",
                  }}
                />
              </button>
            </div>
          </div>
          {selectedInteraction !== null && selectedInteractionData !== null && (
            <div className="right_section">
              <div className="result_header">
                {selectedInteractionData.protocol !== "smtp" && (
                  <>
                    <div className="req_res_buttons">
                      <button
                        type="button"
                        className={
                          storedData.view === "request" ? "__selected_req_res_button" : undefined
                        }
                        onClick={() => handleChangeView("request")}
                      >
                        Request
                      </button>
                      <button
                        type="button"
                        className={
                          storedData.view === "response" ? "__selected_req_res_button" : undefined
                        }
                        onClick={() => handleChangeView("response")}
                      >
                        Response
                      </button>
                    </div>
                    <SideBySideIcon
                      style={{
                        fill: storedData.view === "side_by_side" ? "#ffffff" : "#4a4a4a",
                      }}
                      onClick={() => handleChangeView("side_by_side")}
                    />
                    <UpDownIcon
                      style={{
                        fill: storedData.view === "up_and_down" ? "#ffffff" : "#4a4a4a",
                      }}
                      onClick={() => handleChangeView("up_and_down")}
                    />
                  </>
                )}
                <div className="result_info">
                  From IP address
                  <span>{selectedInteractionData["remote-address"]}</span>
                  {` at `}
                  <span>
                    {format(new Date(selectedInteractionData.timestamp), "yyyy-mm-dd_hh:mm")}
                  </span>
                </div>
              </div>
              <RequestDetailsWrapper
                selectedInteractionData={selectedInteractionData as any}
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
