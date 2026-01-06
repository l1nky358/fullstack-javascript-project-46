import stylish from './stylish.js';

const formatters = {
  stylish,
};

export default (format) => {
  const formatter = formatters[format];
  if (!formatter) {
    throw new Error(`Unknown format: ${format}`);
  }
  return formatter;
};