import fs from 'fs';
import _ from 'lodash';

const genDiff = (filepath1, filepath2) => {
  const data1 = parseFile(filepath1);
  const data2 = parseFile(filepath2);
  return formatDiff(buildDiff(data1, data2));
};

const parseFile = (filepath) => {
  const content = fs.readFileSync(filepath, 'utf-8');
  return JSON.parse(content);
};

const buildDiff = (data1, data2) => {
  const keys = _.sortBy(_.union(_.keys(data1), _.keys(data2)));
  
  return keys.map((key) => {
    if (!_.has(data2, key)) {
      return { key, status: 'removed', value: data1[key] };
    }
    if (!_.has(data1, key)) {
      return { key, status: 'added', value: data2[key] };
    }
    if (data1[key] === data2[key]) {
      return { key, status: 'unchanged', value: data1[key] };
    }
    return {
      key,
      status: 'changed',
      oldValue: data1[key],
      newValue: data2[key],
    };
  });
};

const formatDiff = (diff) => {
  const lines = diff.map((item) => {
    switch (item.status) {
      case 'removed':
        return `  - ${item.key}: ${item.value}`;
      case 'added':
        return `  + ${item.key}: ${item.value}`;
      case 'changed':
        return `  - ${item.key}: ${item.oldValue}\n  + ${item.key}: ${item.newValue}`;
      default:
        return `    ${item.key}: ${item.value}`;
    }
  });
  
  return `{\n${lines.join('\n')}\n}`;
};

export default genDiff;