import { DateFilterSet } from '../../core/care/care.enum';

export const getUtcStartDate = () => {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  return new Date(Date.UTC(year, month, day, 0, 0, 0));
};

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

export const getFromDateFilter = (set: number = 0) => {
  const DefaultMonth = 2;

  if (set === DateFilterSet.TwoMonthAgo) {
    return subtractUtcMonth(getUtcStartDate(), DefaultMonth + 2);
  }

  if (set === DateFilterSet.FourMonthAgo) {
    return subtractUtcMonth(getUtcStartDate(), DefaultMonth + 4);
  }

  if (set === DateFilterSet.SixMonthAgo) {
    return subtractUtcMonth(getUtcStartDate(), DefaultMonth + 6);
  }

  if (set === DateFilterSet.LastYear) {
    return subtractUtcMonth(getUtcStartDate(), DefaultMonth + 12);
  }

  return subtractUtcMonth(getUtcStartDate(), DefaultMonth);
};
