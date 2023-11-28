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

  const newDate = new Date();
  const monthOfStartPeriod = Math.floor(newDate.getMonth() / 2) * 2;

  newDate.setMonth(monthOfStartPeriod);
  newDate.setDate(1);

  return newDate;
};

export const getBirthday = (date: Date | string) => {
  if (!date) {
    return '';
  }

  const birthday = new Date(date);
  const day = birthday.getDate();
  const month = birthday.getMonth() + 1;

  return `${day}`.padStart(2, '0') + '/' + `${month}`.padStart(2, '0');
};

export const formatMonthDay = (date: Date | string) => {
  if (!date) {
    return '';
  }

  const d = new Date(date);
  const day = d.getDate();
  const month = d.getMonth() + 1;

  return `${month}`.padStart(2, '0') + '/' + `${day}`.padStart(2, '0');
};

export const isValidDateString = (dateString: any) => {
  if (typeof dateString !== 'string') {
    return false;
  }

  const timestamp = Date.parse(dateString);

  return !isNaN(timestamp);
};

export const convertToStartOfUtcDate = (date: any): Date | null => {
  if (!isValidDateString(date)) {
    return null;
  }

  const stdDate = new Date(date);

  const y = stdDate.getFullYear();
  const m = stdDate.getMonth();
  const d = stdDate.getDate();

  return new Date(Date.UTC(y, m, d, 0, 0, 0));
};

export const createStartOfDate = (utcOffset = 0) => {
  const date = new Date();
  const y = date.getFullYear();
  const m = date.getMonth();
  const d = date.getDate();

  const utcDate = new Date(Date.UTC(y, m, d, 0, 0, 0));

  if (!utcOffset) {
    return utcDate;
  }

  utcDate.setMinutes(-utcOffset);

  return utcDate;
};
