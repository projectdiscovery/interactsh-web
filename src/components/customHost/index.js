import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './styles.scss';
import ArrowRightIcon from '../../assets/svg/arrow_right.svg';
import CloseIcon from '../../assets/svg/close.svg';

const CustomHost = props => {
  const { handleCloseDialog } = props;
  let host = localStorage.getItem('host');
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] = useState(false);
  const [inputValue, setInputValue] = useState(host == 'hackwithautomation.com' ? '' : host);

  const handleDeleteConfirmationVisibility = () => {
    setIsDeleteConfirmationVisible(!isDeleteConfirmationVisible);
  };

  const handleInput = e => {
    setInputValue(e.target.value);
  };

  const handleConfirm = () => {
    if (inputValue != '') {
      localStorage.clear();
      localStorage.setItem('host', inputValue);
      location.reload();
      handleCloseDialog();
    }
  };

  const handleDelete = () => {
    localStorage.clear();
    location.reload();
    // handleCloseDialog();
  };

  return (
    <div className={styles.container}>
      {isDeleteConfirmationVisible ? (
        <div className={styles.dialog_box}>
          <div className={styles.header}>
            <span>Remove Custom Host</span>
            <CloseIcon onClick={handleDeleteConfirmationVisibility} />
          </div>
          <span>
            Please confirm the action, this action can’t be undone and all the client data will be
            delete immediately.
          </span>
          <div className={styles.buttons}>
            <div className={styles.delete_button} onClick={handleDelete}>
              Delete
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.dialog_box}>
          <div className={styles.header}>
            <span>Custom Host</span>
            <CloseIcon onClick={handleCloseDialog} />
          </div>
          <span>You can point your custom server with this hosted web client.</span>
          <input type="text" placeHolder="host" value={inputValue} onChange={handleInput} />
          <div className={styles.buttons}>
            {host != 'hackwithautomation.com' && (
              <div className={styles.remove_button} onClick={handleDeleteConfirmationVisibility}>
                Remove Custom Host
              </div>
            )}
            <div className={styles.submit_button} onClick={handleConfirm}>
              Confirm <ArrowRightIcon />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomHost;
