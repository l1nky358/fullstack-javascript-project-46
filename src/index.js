import { readFileSync } from 'fs';
import { extname } from 'path';
import parse from '../src/formatters/parsers.js';
import buildDiff from '../src/buildTree.js';
import getFormatter from '../src/formatters/index.js';

const getFormat = (filepath) => extname(filepath).slice(1);
const readFile = (filepath) => readFileSync(filepath, 'utf-8');

const genDiff = (filepath1, filepath2, formatName = 'stylish') => {
  const format1 = getFormat(filepath1);
  const format2 = getFormat(filepath2);
  
  const data1 = parse(readFile(filepath1), format1);
  const data2 = parse(readFile(filepath2), format2);
  
  const diff = buildDiff(data1, data2);
  const formatter = getFormatter(formatName);
  
  return formatter(diff);
};

export default genDiff;
