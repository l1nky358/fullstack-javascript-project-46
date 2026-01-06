import { parseFile } from './parsers.js';
import buildTree from './buildTree.js';
import getFormatter from './formatters/index.js';

const gendiff = (filepath1, filepath2, format = 'stylish') => {
  const data1 = parseFile(filepath1);
  const data2 = parseFile(filepath2);
  
  const tree = buildTree(data1, data2);
  const formatDiff = getFormatter(format);
  
  return formatDiff(tree);
};

export default gendiff;