import formatStylish from '../src/formatters/stylish.js';
import formatPlain from '../src/formatters/plain.js';
import formatJson from '../src/formatters/json.js';

const formatters = {
  stylish: formatStylish,
  plain: formatPlain,
  json: formatJson,
};

export default (formatName) => {
  const formatter = formatters[formatName];
  
  if (!formatter) {
    throw new Error(`Unknown format: ${formatName}`);
  }
  
  return formatter;
};
