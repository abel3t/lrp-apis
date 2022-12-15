type Order = 'asc' | 'desc';

export const arraySortBy = (
  array: Record<string, any>[],
  key: string,
  orderBy?: Order
) => {
  const newArray = [...array];

  newArray.sort((a, b) => {
    if (orderBy == 'desc') {
      return a[key] > b[key] ? -1 : 1;
    }

    return a[key] > b[key] ? 1 : -1;
  });

  return newArray;
};
