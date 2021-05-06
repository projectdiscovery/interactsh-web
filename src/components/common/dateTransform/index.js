import React from 'react';
import dayjs from 'dayjs';

const nth = d => {
  if (d > 3 && d < 21) return 'th';
  switch (d % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
};

const addZero = i => {
  if (i < 10) {
    i = `0${i}`;
  }
  return i;
};

const monthNames = [
  'Jan',
  'Febr',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];

const dateTransform = (value, type) => {
  const currentDate = new Date();
  const timestamp = new Date(value);
  const hours = addZero(timestamp.getHours());
  const minutes = timestamp.getMinutes();
  const date = timestamp.getDate();
  const month = timestamp.getMonth();
  const year = timestamp.getFullYear();

  if (type == 'day-time') {
    return (
      <span style={{ color: '#9B9B9B' }}>
        {currentDate.getDate() == date ? 'Today' : `${date}${nth(date)} ${monthNames[month]}`}
        <span style={{ color: '#ffffff', marginLeft: '2rem' }}>{`/ ${hours}:${minutes} EST`}</span>
      </span>
    );
  }
  if (type == 'month-word-date') {
    return (
      <span style={{ color: '#9B9B9B' }}>
        {currentDate.getDate() == date ? 'Today' : `${date}${nth(date)} ${monthNames[month]}, ${year}`}
      </span>
    );
  }
  if (type == 'yyyy-mm-dd') {
      return `${year}-${addZero(month + 1)}-${addZero(date)}`;
  }
  if (type == 'yyyy-mm-dd_hh:mm') {
      return `${year}-${addZero(month + 1)}-${addZero(date)}-${hours}-${minutes}`;
  }
  if (type == 'yyyy/mm/dd') {
    return `${year}/${addZero(month + 1)}/${addZero(date)}`;
  }
  if (type == 'time') {
    return `T${hours}:${minutes}`;
  }
  if (type == 'last-change') {
      const lastChangeDate = dayjs(new Date(value));
        var seconds = Math.floor((currentDate - lastChangeDate) / 1000);
      
        var interval = seconds / 31536000;
      
        if (interval > 1) {
          return Math.floor(interval) + " years";
        }
        interval = seconds / 2592000;
        if (interval > 1) {
          return Math.floor(interval) + " months";
        }
        interval = seconds / 86400;
        if (interval > 1) {
          return Math.floor(interval) + " days";
        }
        interval = seconds / 3600;
        if (interval > 1) {
          return Math.floor(interval) + " hours";
        }
        interval = seconds / 60;
        if (interval > 1) {
          return Math.floor(interval) + " minutes";
        }
        return Math.floor(seconds) + " seconds";
  }
};

export default dateTransform;
