export const getVietnameseFirstName = (name: string = '') => {
  if (!name || typeof name !== 'string') {
    return '';
  }

  const chunks = name.split(' ');
  return chunks[chunks.length - 1];
};
