import React from 'react';
import styles from './styles.scss';
import lastDateChange from '../../libs/last-date-change';

const RequestsTable = props => {
  const { data, handleRowClick, selectedInteraction } = props;

  return (
    <table className={styles.requests_table}>
      <thead className={'secondary_bg'}>
        <tr>
          <th>#</th>
          <th>TIME</th>
          <th>TYPE</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, i) => {
          return (
            <tr
              key={i}
              onClick={() => handleRowClick(item.id)}
              className={item.id == selectedInteraction ? styles.selected_row : ''}
            >
              <td>{i + 1}</td>
              <td>{lastDateChange(item.timestamp)}</td>
              <td>{item.protocol}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default RequestsTable;
