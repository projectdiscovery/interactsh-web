/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import { ThemeProvider } from "styled-components";
import NodeRSA from "node-rsa";
import { v4 as uuidv4 } from "uuid";
import xid from "xid-js";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./styles.scss";
import { ReactComponent as ChevronUpIcon } from "../../assets/svg/chevron_up.svg";
import { ReactComponent as SideBySideIcon } from "../../assets/svg/side_by_side.svg";
import { ReactComponent as UpDownIcon } from "../../assets/svg/up_down.svg";
import Header from "../../components/header";
import TabSwitcher from "../../components/tabSwitcher";
import RequestsTableWrapper from "./requestsTableWrapper";
import { GlobalStyles } from "../../globalStyles";
import { blueTheme, darkTheme, synthTheme } from "../../Themes";
import RequestDetailsWrapper from "./requestDetailsWrapper";
import format from "date-fns/format";
import { ReactComponent as CopyIcon } from "../../assets/svg/copy.svg";
import { ReactComponent as CloseIcon } from "../../assets/svg/close.svg";
import { ReactComponent as ClearIcon } from "../../assets/svg/clear.svg";
import {
  generateUrl,
  poll,
  decryptAESKey,
  processData,
  setToLocalStorage,
  register,
  copyDataToClipboard,
} from "../../libs";

const HomePage = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [tabs, setTabs] = useState(
    JSON.parse(localStorage.getItem("tabs")) || []
  );
  const [data, setData] = useState(
    JSON.parse(localStorage.getItem("data")) || []
  );
  const [filteredData, setFilteredData] = useState([]);
  const [selectedInteraction, setSelectedInteraction] = useState("");
  const [selectedInteractionData, setSelectedInteractionData] = useState({});
  const [selectedTab, setSelectedTab] = useState(
    JSON.parse(localStorage.getItem("selectedTab"))
  );
  const [pollIntervals, setPollIntervals] = useState([]);
  const [view, setView] = useState(localStorage.getItem("view"));
  const [aboutPopupVisibility, setAboutPopupVisibility] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("correlationId") == null) {
      const key = new NodeRSA({ b: 2048 });
      const pub = key.exportKey("pkcs8-public-pem");
      const priv = key.exportKey("pkcs8-private-pem");
      const correlation = xid.next().toString();
      const secret = uuidv4().toString();
      // Setting initial value
      setView("up_and_down");
      setToLocalStorage({
        theme: "dark",
        privateKey: priv,
        publicKey: pub,
        correlationId: correlation,
        secretKey: secret,
        data: JSON.stringify([]),
        aesKey: null,
        notes: JSON.stringify([]),
        view: "up_and_down",
      });
      if (localStorage.getItem("host") == null) {
        setToLocalStorage({ host: "interact.sh" });
      }

      const response = register(pub, secret, correlation);

      setToLocalStorage({ increment: 1 });
      const generatedUrl = generateUrl(
        correlation,
        localStorage.getItem("increment"),
        localStorage.getItem("host")
      );
      const lastTabsId = tabs.slice(-1)[0] ? tabs.slice(-1)[0].id : 0;
      const tabData = [
        {
          id: lastTabsId + 1,
          correlationId: correlation,
          name: lastTabsId + 1,
          url: generatedUrl,
          note: "",
        },
      ];
      const selectedTabData = {
        id: lastTabsId + 1,
        correlationId: correlation,
        name: lastTabsId + 1,
        url: generatedUrl,
        note: "",
      };
      setTabs(tabData);
      setSelectedTab(selectedTabData);
      setToLocalStorage({
        tabs: JSON.stringify(tabData),
        selectedTab: JSON.stringify(selectedTabData),
      });

      pollIntervals.map((item) => {
        clearInterval(item);
      });

      const interval = setInterval(() => {
        processPolledData();
      }, 4000);
      setPollIntervals([...pollIntervals, interval]);

      // Clear localstorage if registration fails
      response
        .then((res) => {
          if (res.status !== 200) {
            localStorage.clear();
          }
        })
        .catch(() => {
          localStorage.clear();
        });
    }
  }, []);

  const processPolledData = async () => {
    const privateKey = localStorage.getItem("privateKey");
    const aesKey = localStorage.getItem("aesKey");
    const dataFromLocalStorage = JSON.parse(localStorage.getItem("data"));
    const correlation = localStorage.getItem("correlationId");
    const secret = localStorage.getItem("secretKey");
    const host = localStorage.getItem("host");

    const polledData = await poll(correlation, secret, host);

    if (aesKey == "null" && polledData.aes_key) {
      setToLocalStorage({ aesKey: decryptAESKey(privateKey, polledData) });
    }
    if (polledData.data?.length !== 0) {
      const processedData = processData(
        Buffer.from(aesKey, "base64"),
        polledData
      );
      const combinedData = Array.isArray(processedData)
        ? [...dataFromLocalStorage, ...processedData]
        : dataFromLocalStorage;

      setData(combinedData);
      setToLocalStorage({ data: JSON.stringify(combinedData) });
      const selectedTabUrl = selectedTab.url.slice(
        0,
        -localStorage.getItem("host").length - 1
      );
      let newData = combinedData.filter(
        (item) => item["unique-id"] == selectedTabUrl
      );
      console.log(filteredData);
      newData = newData.map((item, i) => ({ id: i + 1, ...item }));
      setFilteredData([...newData]);
    }
  };

  // Recalculate data when a tab is selected
  useEffect(() => {
    pollIntervals.map((item) => {
      clearInterval(item);
    });
    if (tabs !== null && tabs.length > 0) {
      const interval = setInterval(() => {
        processPolledData();
      }, 4000);
      setPollIntervals([...pollIntervals, interval]);
      const selectedTabUrl = selectedTab.url.slice(
        0,
        -localStorage.getItem("host").length - 1
      );
      let tempFilteredData = data.filter(
        (item) => item["unique-id"] == selectedTabUrl
      );
      tempFilteredData = tempFilteredData.map((item, i) => ({
        id: i + 1,
        ...item,
      }));
      setFilteredData([...tempFilteredData]);
    }
  }, [selectedTab]);

  // "Switch theme" function
  const handleThemeSelection = (value) => {
    setTheme(value);
    setToLocalStorage({ theme: value });
  };

  // "Select a tab" function
  const handleTabButtonClick = (value) => {
    setSelectedTab(value);
    setToLocalStorage({ selectedTab: JSON.stringify(value) });
    setSelectedInteraction("");
  };

  // " Add new tab" function
  const handleAddNewTab = () => {
    const correlation = localStorage.getItem("correlationId");
    const increment = Number(localStorage.getItem("increment"));
    const host = localStorage.getItem("host");
    const newUrl = generateUrl(correlation, increment, host);
    const newIncrement = increment + 1;
    const tabData = {
      id: newIncrement,
      correlationId: correlation,
      name: newIncrement,
      url: newUrl,
      note: "",
    };
    const selectedTabData = {
      id: newIncrement,
      correlationId: correlation,
      name: newIncrement,
      url: newUrl,
      note: "",
    };
    setTabs([...tabs, tabData]);
    setSelectedTab(selectedTabData);
    setToLocalStorage({
      tabs: JSON.stringify([...tabs, tabData]),
      selectedTab: JSON.stringify(selectedTabData),
      increment: newIncrement,
    });
  };

  // "Show or hide notes" function
  const handleNotesVisibility = () => {
    setTimeout(() => {
      document.getElementById("notes_textarea").focus();
    }, 200);
    setIsNotesOpen(!isNotesOpen);
  };

  // "Notes input change handler" function
  const handleNoteInputChange = (e) => {
    const tempTabsList = JSON.parse(localStorage.getItem("tabs"));
    const index = tempTabsList.findIndex((item) => item.id == selectedTab.id);
    tempTabsList[index].note = e.target.value;
    setToLocalStorage({ tabs: JSON.stringify(tempTabsList) });
    setTabs([...tempTabsList]);
  };

  // "Selecting a specific interaction" function
  const handleRowClick = (id) => {
    setSelectedInteraction(id);
    const reqDetails =
      filteredData[filteredData.findIndex((item) => item.id == id)];
    setSelectedInteractionData(reqDetails);
  };

  // "Deleting a tab" function
  const handleDeleteTab = (id) => {
    const tempTabsList = [...tabs];
    const filteredTempTabsList = tempTabsList.filter(
      (value) => Number(value.id) !== Number(id)
    );
    const tempTabsData = [...data];
    const filteredTempTabsData = tempTabsData.filter(
      (value) => Number(value.id) !== Number(id)
    );
    setSelectedTab({ ...filteredTempTabsList[0] });
    setToLocalStorage({ selectedTab: JSON.stringify(filteredTempTabsList[0]) });
    setTabs([...filteredTempTabsList]);
    setToLocalStorage({ tabs: JSON.stringify([...filteredTempTabsList]) });
    setData([...filteredTempTabsData]);
    setToLocalStorage({ data: JSON.stringify([...filteredTempTabsData]) });
  };

  // "Renaming a tab" function
  const handleTabRename = (e) => {
    const tempTabsList = JSON.parse(localStorage.getItem("tabs"));
    const index = tempTabsList.findIndex((item) => item.id == selectedTab.id);
    tempTabsList[index].name = e.target.value;
    setToLocalStorage({ tabs: JSON.stringify(tempTabsList) });
    setTabs([...tempTabsList]);
  };

  // "View selector" function
  const handleChangeView = (value) => {
    setView(value);
    setToLocalStorage({ view: value });
  };

  // "Show or hide about popup" function
  const handleAboutPopupVisibility = () => {
    setAboutPopupVisibility(!aboutPopupVisibility);
  };

  // "Clear interactions of a tab" function
  const clearInteractions = () => {
    const tempData = data.filter(
      (item) =>
        item["unique-id"] !==
        selectedTab.url.substring(0, selectedTab.url.length - 12)
    );
    setToLocalStorage({ data: JSON.stringify(tempData) });
    setData([...tempData]);
    setFilteredData([]);
  };

  const selectedTabsIndex = tabs.findIndex((item) => item.id == selectedTab.id);

  return (
    <ThemeProvider
      theme={
        theme === "dark" ? darkTheme : theme == "synth" ? synthTheme : blueTheme
      }
    >
      <>
        <GlobalStyles />
        <div className="main">
          {aboutPopupVisibility && (
            <div className="about_popup_wrapper">
              <div className="about_popup">
                <div className="about_popup_header">
                  <span>About</span>
                  <CloseIcon
                    style={{ width: 14 }}
                    onClick={handleAboutPopupVisibility}
                  />
                </div>
                <div className="about_popup_body">
                  Interactsh is an Open-Source solution for Out of band Data
                  Extraction, A tool designed to detect bugs that cause external
                  interactions, For example - Blind SQLi, Blind CMDi, SSRF, etc.
                  <br />
                  <br />
                  If you find communications or exchanges with the Interact.sh
                  server in your logs, it is possible that someone has been
                  testing your applications using our hosted service,
                  <a
                    href="https://interact.projectdiscovery.io"
                    target="__blank"
                  >
                    {` interact.projectdiscovery.io `}
                  </a>
                  You should review the time when these interactions were
                  initiated to identify the person responsible for this testing.
                  <br />
                  <br />
                  For further details about Interact.sh,
                  <a
                    href="https://github.com/projectdiscovery/interactsh"
                    target="__blank"
                  >
                    {` checkout opensource code.`}
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
          <div className="body">
            <div className="left_section">
              <div className="url_container secondary_bg">
                <div title={selectedTab && selectedTab.url}>
                  {selectedTab && selectedTab.url}
                </div>
                <CopyIcon
                  style={{ width: 13 }}
                  onClick={() => copyDataToClipboard(selectedTab.url)}
                />
                <div className="vertical_bar" />
                <ClearIcon
                  className={
                    filteredData.length <= 0 && "clear_button__disabled"
                  }
                  onClick={clearInteractions}
                />
              </div>
              <RequestsTableWrapper
                data={[...filteredData]}
                selectedInteraction={selectedInteraction}
                handleRowClick={handleRowClick}
              />
              <div className="notes secondary_bg">
                <div
                  className="detailed_notes"
                  style={{ display: isNotesOpen ? "flex" : "none" }}
                >
                  {/* <SyntaxHighlighter language="javascript" style={dark}> */}
                  {/* {tabs[selectedTabsIndex].note} */}
                  <textarea
                    id="notes_textarea"
                    placeholder="Please paste note here max 1200 charachters.."
                    autoFocus
                    value={
                      tabs[selectedTabsIndex] && tabs[selectedTabsIndex].note
                    }
                    onChange={handleNoteInputChange}
                  />
                  {/* </SyntaxHighlighter> */}
                </div>
                <div onClick={handleNotesVisibility} className="notes_footer">
                  <span>Notes</span>
                  <ChevronUpIcon
                    style={{
                      transform: isNotesOpen ? "rotate(180deg)" : "rotate(0)",
                    }}
                  />
                </div>
              </div>
            </div>
            {selectedInteraction !== "" && (
              <div className="right_section">
                <div className="result_header">
                  <div className="req_res_buttons">
                    <span
                      className={
                        view == "request" && "__selected_req_res_button"
                      }
                      onClick={() => handleChangeView("request")}
                    >
                      Request
                    </span>
                    <span
                      className={
                        view == "response" && "__selected_req_res_button"
                      }
                      onClick={() => handleChangeView("response")}
                    >
                      Response
                    </span>
                  </div>
                  <SideBySideIcon
                    style={{
                      fill: view == "side_by_side" ? "#ffffff" : "#4a4a4a",
                    }}
                    onClick={() => handleChangeView("side_by_side")}
                  />
                  <UpDownIcon
                    style={{
                      fill: view == "up_and_down" ? "#ffffff" : "#4a4a4a",
                    }}
                    onClick={() => handleChangeView("up_and_down")}
                  />
                  <div className="result_info">
                    From IP address
                    <span>{selectedInteractionData["remote-address"]}</span>
                    {` at `}
                    <span>
                      {format(
                        selectedInteractionData.timestamp,
                        "yyyy-mm-dd_hh:mm"
                      )}
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
