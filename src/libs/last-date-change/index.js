import dayjs from 'dayjs';

export default date => {
  const lastChangeDate = dayjs(new Date(date));
  const currentDate = dayjs(new Date());
  const daysDiff = currentDate.diff(lastChangeDate, 'minute');

  return `${daysDiff} min ago`;
};
