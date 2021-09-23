/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";

import formatDistance from "date-fns/formatDistance";
import { now } from "fp-ts/Date";

import { ReactComponent as FilterIcon } from "assets/svg/filter.svg";
import { ReactComponent as FilterSelectedIcon } from "assets/svg/filter_selected.svg";
import { getStoredData, writeStoredData } from "lib/localStorage";
import { Data } from "lib/types/data";
import Filter from "lib/types/filter";
import Protocal, { protocols } from 'lib/types/protocal';
import { trueKeys } from 'lib/utils';

import "./styles.scss";

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
  const [filterValue, setFilterValue] = useState<Filter>(filter);

  const filterData = (f: Filter) => {
    const selectedFilters = trueKeys(filterValue);

    const tempData = data.filter((item) => selectedFilters.indexOf(item.protocol) !== -1);
    if (Object.values(f).indexOf(false) > -1) {
      setIsFiltered(true);
    } else {
      setIsFiltered(false);
    }

    return tempData;
  };

  useEffect(() => {
    setFilteredData(filterData(filterValue));
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

  useEffect(() => {
    window.addEventListener("storage", () => {
      setFilterValue(getStoredData().filter);
      if (Object.values(getStoredData().filter).indexOf(false) > -1) {
        setIsFiltered(true);
      } else {
        setIsFiltered(false);
      }
    });
  }, []);

  const handleFilterSelection = (e: any) => {
    const newFilterValue: typeof filterValue = {
      ...filterValue,
      [e.target.value]: e.target.checked,
    };

    setFilterValue(newFilterValue);
    writeStoredData({ ...getStoredData(), filter: newFilterValue });

    setFilteredData(filterData(newFilterValue));
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
                    {protocols.map(p => (
                        <li>
                            <label htmlFor={p}>
                                <input
                                    onChange={handleFilterSelection}
                                    type="checkbox"
                                    name="filter"
                                    id={p}
                                    value={p}
                                    checked={filterValue[p]}
                                />
                                <span className="checkmark" />
                                <span>{ Protocal.show.show(p) }</span>
                            </label>
                        </li>
                    ))}
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
