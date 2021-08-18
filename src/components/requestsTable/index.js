import React from "react";
import "./styles.scss";
import formatDistance from "date-fns/formatDistance";

import { now } from "fp-ts/Date";

const RequestsTable = (props) => {
  const { data, handleRowClick, selectedInteraction } = props;

  return (
    <table className="requests_table">
      <thead className="secondary_bg">
        <tr>
          <th>#</th>
          <th>TIME</th>
          <th>TYPE</th>
        </tr>
      </thead>
      <tbody>
        {data.reverse().map((item, i) => (
          <tr
            key={i}
            onClick={() => handleRowClick(item.id)}
            className={item.id == selectedInteraction ? "selected_row" : ""}
          >
            <td>{data.length - i}</td>
            <td>{formatDistance(item.timestamp, now, { addSuffix: true })}</td>
            <td>{item.protocol}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RequestsTable;
