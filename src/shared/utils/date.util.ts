import { DateFilterSet } from '../../core/care/care.enum';

export const getUtcDate = () => {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  return new Date(Date.UTC(year, month, day, 0, 0, 0));
};

export const subtractUtcMonth = (date: Date, month: number) => {
  const newDate = new Date(date);
  newDate.setMonth(date.getUTCMonth() - month);

  return newDate;
};

export const getToDateFilter = (set: number = 0) => {
  if (set === DateFilterSet.TwoMonthAgo) {
    return subtractUtcMonth(getUtcDate(), 2);
  }

  if (set === DateFilterSet.FourMonthAgo) {
    return subtractUtcMonth(getUtcDate(), 4);
  }

  if (set === DateFilterSet.SixMonthAgo) {
    return subtractUtcMonth(getUtcDate(), 6);
  }

  if (set === DateFilterSet.LastYear) {
    return subtractUtcMonth(getUtcDate(), 12);
  }

  return subtractUtcMonth(getUtcDate(), 0);
};
