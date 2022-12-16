import { DateFilterSet } from '../../core/care/care.enum';

export const getUtcEndDate = () => {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  return new Date(Date.UTC(year, month, day, 23, 59, 59));
};

export const subtractUtcMonth = (date: Date, month: number) => {
  const newDate = new Date(date);
  newDate.setMonth(date.getUTCMonth() - month);

  return newDate;
};

export const getToDateFilter = (set: number = 0) => {
  if (set === DateFilterSet.TwoMonthAgo) {
    return subtractUtcMonth(getUtcEndDate(), 2);
  }

  if (set === DateFilterSet.FourMonthAgo) {
    return subtractUtcMonth(getUtcEndDate(), 4);
  }

  if (set === DateFilterSet.SixMonthAgo) {
    return subtractUtcMonth(getUtcEndDate(), 6);
  }

  if (set === DateFilterSet.LastYear) {
    return subtractUtcMonth(getUtcEndDate(), 12);
  }

  return subtractUtcMonth(getUtcEndDate(), 0);
};
