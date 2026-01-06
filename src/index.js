import { parseFile } from './parsers.js';
import { buildDiff, formatDiff } from './diff.js';

const gendiff = (filepath1, filepath2) => {
  const data1 = parseFile(filepath1);
  const data2 = parseFile(filepath2);
  
  const diff = buildDiff(data1, data2);
  return formatDiff(diff);
};

export default gendiff;