import formatStylish from './stylish.js';
import formatPlain from './plain.js';

const formatters = {
  stylish: formatStylish,
  plain: formatPlain,
};

export default (formatName) => {
  const formatter = formatters[formatName];
  
  if (!formatter) {
    throw new Error(`Unknown format: ${formatName}`);
  }
  
  return formatter;
};