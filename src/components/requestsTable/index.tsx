/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";

import "./styles.scss";

import formatDistance from "date-fns/formatDistance";
import { now } from "fp-ts/Date";

import { ReactComponent as FilterIcon } from "assets/svg/filter.svg";
import { ReactComponent as FilterSelectedIcon } from "assets/svg/filter_selected.svg";
import { Data, getStoredData, writeStoredData } from "lib/localStorage";
import Filter from "lib/types/filter";

interface RequestsTableP {
  data: Data[];
  handleRowClick: (id: string) => void;
  selectedInteraction: string;
  filter: Filter;
}

const RequestsTable = ({ data, handleRowClick, selectedInteraction, filter }: RequestsTableP) => {
  const [filteredData, setFilteredData] = useState<Data[]>(data);
  const [filterDropdownVisibility, setFilterDropdownVisibility] = useState<boolean>(false);
  const [isFiltered, setIsFiltered] = useState<boolean>(false);
  const [filterValue, setFilterValue] = useState<{
    dns: boolean;
    http: boolean;
    smtp: boolean;
    [key: string]: boolean;
  }>(filter);

  useEffect(() => {
    const tempData = Object.keys(filterValue).map((f) =>
      filterValue[f] ? data.filter((item) => item.protocol === f) : []
    );
    const newFilteredData = Array.prototype.concat.apply([], tempData);
    setFilteredData(newFilteredData);
    if (Object.values(filterValue).indexOf(false) > -1) {
      setIsFiltered(true);
    } else {
      setIsFiltered(false);
    }
  }, [data]);

  const handleFilterDropdownVisibility = () => {
    const dropdownElement = document.getElementById("filter_dropdown");
    setFilterDropdownVisibility(!filterDropdownVisibility);
    document.addEventListener("click", (e: any) => {
      const isClickInsideElement = dropdownElement?.contains(e.target);
      if (!isClickInsideElement) {
        setFilterDropdownVisibility(false);
      }
    });
  };

  const handleFilterSelection = (e: any) => {
    const newFilterValue: typeof filterValue = {
      ...filterValue,
      [e.target.value]: e.target.checked,
    };
    if (Object.values(newFilterValue).indexOf(false) > -1) {
      setIsFiltered(true);
    } else {
      setIsFiltered(false);
    }
    setFilterValue(newFilterValue);
    writeStoredData({ ...getStoredData(), filter: newFilterValue });

    const tempData = Object.keys(newFilterValue).map((f) =>
      newFilterValue[f] ? data.filter((item) => item.protocol === f) : []
    );
    const newFilteredData = Array.prototype.concat.apply([], tempData);
    setFilteredData(newFilteredData);
  };

  return (
    <table className="requests_table">
      <thead className="secondary_bg">
        <tr>
          <th>#</th>
          <th>TIME</th>
          <th>
            <div id="filter_dropdown">
              <div
                className={isFiltered ? "__filtered" : ""}
                onClick={handleFilterDropdownVisibility}
              >
                TYPE
                {isFiltered ? <FilterSelectedIcon /> : <FilterIcon />}
              </div>
              {filterDropdownVisibility && (
                <div className="filter_dropdown secondary_bg">
                  <ul>
                    <li>
                      <label htmlFor="dns">
                        <input
                          onChange={handleFilterSelection}
                          type="checkbox"
                          name="filter"
                          id="dns"
                          value="dns"
                          checked={filterValue.dns === true}
                        />
                        <span>DNS</span>
                      </label>
                    </li>
                    <li>
                      <label htmlFor="http">
                        <input
                          onChange={handleFilterSelection}
                          type="checkbox"
                          name="filter"
                          id="http"
                          value="http"
                          checked={filterValue.http === true}
                        />
                        <span>HTTP</span>
                      </label>
                    </li>
                    <li>
                      <label htmlFor="smtp">
                        <input
                          onChange={handleFilterSelection}
                          type="checkbox"
                          name="filter"
                          id="smtp"
                          value="smtp"
                          checked={filterValue.smtp === true}
                        />
                        <span>SMTP</span>
                      </label>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {filteredData.map((item, i) => (
          <tr
            key={item.id}
            onClick={() => handleRowClick(item.id)}
            className={item.id === selectedInteraction ? "selected_row" : ""}
          >
            <td>{filteredData.length - i}</td>
            <td>
              {formatDistance(new Date(item.timestamp), now(), {
                addSuffix: true,
              })}
            </td>
            <td>{item.protocol}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RequestsTable;
