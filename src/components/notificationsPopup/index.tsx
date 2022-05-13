/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from "react";

import { Tab } from "@headlessui/react";

import { ReactComponent as ArrowRightIcon } from "assets/svg/arrow_right.svg";
import { ReactComponent as CloseIcon } from "assets/svg/close.svg";
import { ReactComponent as LoadingIcon } from "assets/svg/loader.svg";
import "./styles.scss";
import ToggleBtn from "components/toggleBtn";
import { getStoredData, writeStoredData } from "lib/localStorage";

interface NotificationsPopupP {
  handleCloseDialog: () => void;
}

const NotificationsPopup = ({ handleCloseDialog }: NotificationsPopupP) => {
  const data = getStoredData();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [inputData, setInputData] = useState<any>({
    telegram: data.telegram,
    slack: data.slack,
    discord: data.discord,
  });

  const handleTelegramConfirm = () => {
    setIsLoading(true);
    const currentStoredData = getStoredData();
    setTimeout(() => {
      localStorage.clear();
      writeStoredData({ ...currentStoredData, telegram: inputData.telegram });
      setInputData({ ...inputData });
      setIsLoading(false);
    }, 500);
  };

  const handleDiscordConfirm = () => {
    setIsLoading(true);
    const currentStoredData = getStoredData();
    setTimeout(() => {
      localStorage.clear();
      writeStoredData({ ...currentStoredData, discord: inputData.discord });
      setInputData({ ...inputData });
      setIsLoading(false);
    }, 500);
  };

  const handleSlackConfirm = () => {
    setIsLoading(true);
    const currentStoredData = getStoredData();
    setTimeout(() => {
      localStorage.clear();
      writeStoredData({ ...currentStoredData, slack: inputData.slack });
      setInputData({ ...inputData });
      setIsLoading(false);
    }, 500);
  };

  const handleInput = (e: any) => {
    if (e.target.id === "telegram_bot_token") {
      setInputData({ ...inputData, telegram: { ...inputData.telegram, botToken: e.target.value } });
    } else if (e.target.id === "telegram_chat_id") {
      setInputData({ ...inputData, telegram: { ...inputData.telegram, chatId: e.target.value } });
    } else if (e.target.id === "slack_hook_key") {
      setInputData({ ...inputData, slack: { ...inputData.slack, hookKey: e.target.value } });
    } else if (e.target.id === "slack_channel") {
      setInputData({ ...inputData, slack: { ...inputData.slack, channel: e.target.value } });
    } else if (e.target.id === "discord_webhook") {
      setInputData({ ...inputData, discord: { ...inputData.discord, webhook: e.target.value } });
    } else if (e.target.id === "discord_channel") {
      setInputData({ ...inputData, discord: { ...inputData.discord, channel: e.target.value } });
    }
  };

  const handleToggleBtn = (e: any) => {
    if (e.target.name === "telegram") {
      setInputData({ ...inputData, telegram: { ...inputData.telegram, enabled: e.target.checked } });
      writeStoredData({ ...data, telegram: { ...data.telegram, enabled: e.target.checked } });
    } else if (e.target.name === "slack") {
      setInputData({ ...inputData, slack: { ...inputData.slack, enabled: e.target.checked } });
      writeStoredData({ ...data, slack: { ...data.slack, enabled: e.target.checked } });
    } else if (e.target.name === "discord") {
      setInputData({ ...inputData, discord: { ...inputData.discord, enabled: e.target.checked } });
      writeStoredData({ ...data, discord: { ...data.discord, enabled: e.target.checked } });
    }
  };

  return (
    <div className="backdrop_container">
      <div className="dialog_box">
        <div className="header">
          <span>Notifications</span>
          <CloseIcon onClick={handleCloseDialog} />
        </div>
        <div className="body">
          {/* <div className="toggle_btns">
            <div className="toggle_btn">
              <span>Telegram: </span>
              <ToggleBtn
                name="telegram"
                onChangeHandler={handleToggleBtn}
                value={inputData.telegram.enabled}
              />
            </div>
            <div className="toggle_btn">
              <span>Slack: </span>
              <ToggleBtn
                name="slack"
                onChangeHandler={handleToggleBtn}
                value={inputData.slack.enabled}
              />
            </div>
            <div className="toggle_btn">
              <span>Discord: </span>
              <ToggleBtn
                name="discord"
                onChangeHandler={handleToggleBtn}
                value={inputData.discord.enabled}
              />
            </div>
          </div> */}
          <Tab.Group>
            <Tab.List className="tab_list">
              {({ selectedIndex }) => (
                <>
                  <Tab
                    className="tab"
                    style={{
                      borderColor: selectedIndex === 0 ? "#3254c5" : "#444444",
                      opacity: selectedIndex === 0 ? "1" : "0.7",
                    }}
                  >
                    <div
                      id="editor_button"
                      style={{
                        color: inputData.telegram.enabled ? "#36AE7C" : "#bdbdbd",
                      }}
                    >
                      Telegram
                    </div>
                    <ToggleBtn
                      name="telegram"
                      onChangeHandler={handleToggleBtn}
                      value={inputData.telegram.enabled}
                    />
                  </Tab>
                  <Tab
                    className="tab"
                    style={{
                      borderColor: selectedIndex === 1 ? "#3254c5" : "#444444",
                      opacity: selectedIndex === 1 ? "1" : "0.7",
                    }}
                  >
                    <div
                      id="editor_button"
                      style={{
                        color: inputData.slack.enabled ? "#36AE7C" : "#bdbdbd",
                      }}
                    >
                      Slack
                    </div>
                    <ToggleBtn
                      name="slack"
                      onChangeHandler={handleToggleBtn}
                      value={inputData.slack.enabled}
                    />
                  </Tab>
                  <Tab
                    className="tab"
                    style={{
                      borderColor: selectedIndex === 2 ? "#3254c5" : "#444444",
                      opacity: selectedIndex === 2 ? "1" : "0.7",
                    }}
                  >
                    <div
                      id="editor_button"
                      style={{
                        color: inputData.discord.enabled ? "#36AE7C" : "#bdbdbd",
                      }}
                    >
                      Discord
                    </div>
                    <ToggleBtn
                      name="discord"
                      onChangeHandler={handleToggleBtn}
                      value={inputData.discord.enabled}
                    />
                  </Tab>
                </>
              )}
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel className="panel">
                <input
                  id="telegram_bot_token"
                  type="text"
                  placeholder="Enter telegram bot token"
                  onChange={handleInput}
                  value={inputData.telegram.botToken}
                />
                <input
                  id="telegram_chat_id"
                  type="text"
                  placeholder="Enter telegram chat ID"
                  onChange={handleInput}
                  value={inputData.telegram.chatId}
                />
                <div>
                  <button
                    type="button"
                    className="submit_button"
                    disabled={
                      inputData.telegram.botToken === "" ||
                      inputData.telegram.chatId === "" ||
                      (inputData.telegram.botToken === data.telegram.botToken &&
                        inputData.telegram.chatId === data.telegram.chatId)
                    }
                    onClick={handleTelegramConfirm}
                  >
                    Confirm
                    {isLoading ? <LoadingIcon /> : <ArrowRightIcon />}
                  </button>
                </div>
              </Tab.Panel>
              <Tab.Panel className="panel">
                <input
                  id="slack_hook_key"
                  type="text"
                  placeholder="https://hooks.slack.com/services/XXX/XXX/XXXXXXXX"
                  onChange={handleInput}
                  value={inputData.slack.hookKey}
                />
                <input
                  id="slack_channel"
                  type="text"
                  placeholder="Enter slack channel (optional)"
                  onChange={handleInput}
                  value={inputData.slack.channel}
                />
                <div>
                  <button
                    type="button"
                    className="submit_button"
                    disabled={
                      inputData.slack.hookKey === "" ||
                      (inputData.slack.hookKey === data.slack.hookKey && inputData.slack.channel === data.slack.channel)
                    }
                    onClick={handleSlackConfirm}
                  >
                    Confirm
                    {isLoading ? <LoadingIcon /> : <ArrowRightIcon />}
                  </button>
                </div>
              </Tab.Panel>
              <Tab.Panel className="panel">
                <input
                  id="discord_webhook"
                  type="text"
                  placeholder="https://discord.com/api/webhooks/XXXXX/XXXXXXXXXX"
                  onChange={handleInput}
                  value={inputData.discord.webhook}
                />
                <input
                  id="discord_channel"
                  type="text"
                  placeholder="Enter discord channel (optional)"
                  onChange={handleInput}
                  value={inputData.discord.channel}
                />
                <div>
                  <button
                    type="button"
                    className="submit_button"
                    disabled={
                      inputData.discord.webhook === "" ||
                      (inputData.discord.webhook === data.discord.webhook && inputData.discord.channel === data.discord.channel)
                    }
                    onClick={handleDiscordConfirm}
                  >
                    Confirm
                    {isLoading ? <LoadingIcon /> : <ArrowRightIcon />}
                  </button>
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
        {/* <span>
          Please confirm the action, this action can’t be undone and all the client data will be
          deleted immediately. You can download a copy of your data in JSON format by clicking the
          Export button below or in top right.
        </span>
        <div className="buttons">
          <button type="button" title="Export" className="button" onClick={handleDataExport}>
            Export <DownloadIcon />
          </button>
        </div>
        <div className="buttons">
          <button
            type="button"
            disabled={isLoading}
            className="confirm_button"
            onClick={handleConfirm}
          >
            Confirm {isLoading ? <LoadingIcon /> : <DeleteIcon />}
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default NotificationsPopup;
