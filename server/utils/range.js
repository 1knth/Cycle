
export const getRange = (range) => {
  // range is a string containing '1Y', '1M', '1W', '1D', 'ALL'
  const now = new Date();
  switch (range) {
    case '1D':
      return new Date(now.getFullYear(), now.getMonth(), now.getDate()-1);
    case '1M':
      return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    case '1W':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case '1Y':
      return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    case 'ALL': return null;
    // default to one month
    default: return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  }
};
