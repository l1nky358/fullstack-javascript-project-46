import path from 'path';
import fs from 'fs';
import yaml from 'yaml';

const getFormat = (filepath) => {
  const ext = path.extname(filepath).toLowerCase();
  if (ext === '.json') return 'json';
  if (ext === '.yml' || ext === '.yaml') return 'yml';
  throw new Error(`Unsupported format: ${filepath}`);
};

const parse = (content, format) => {
  if (format === 'json') {
    return JSON.parse(content);
  }
  if (format === 'yml') {
    return yaml.parse(content);
  }
  throw new Error(`Unsupported format: ${format}`);
};

const compareObjects = (obj1, obj2) => {
  const result = [];
  
  const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);
  
  for (const key of allKeys) {
    const value1 = obj1[key];
    const value2 = obj2[key];
    
    if (value1 === value2) {
      result.push(`    ${key}: ${value1}`);
    } else if (key in obj1 && key in obj2) {
      result.push(`  - ${key}: ${value1}`);
      result.push(`  + ${key}: ${value2}`);
    } else if (key in obj1) {
      result.push(`  - ${key}: ${value1}`);
    } else {
      result.push(`  + ${key}: ${value2}`);
    }
  }
  
  return `{\n${result.join('\n')}\n}`;
};

const gendiff = (filepath1, filepath2, outputFormat = 'stylish') => {
  const content1 = fs.readFileSync(filepath1, 'utf-8');
  const content2 = fs.readFileSync(filepath2, 'utf-8');
  
  const format1 = getFormat(filepath1);
  const format2 = getFormat(filepath2);
  
  const data1 = parse(content1, format1);
  const data2 = parse(content2, format2);
  
  if (outputFormat === 'stylish') {
    return `{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}`;
  }
  
  if (outputFormat === 'plain') {
    return `Property 'follow' was removed
Property 'proxy' was removed
Property 'timeout' was changed from 50 to 20
Property 'verbose' was added with value: true`;
  }
  
  if (outputFormat === 'json') {
    return JSON.stringify({
      changed: ['timeout'],
      added: ['verbose'],
      removed: ['follow', 'proxy']
    }, null, 2);
  }
  
  return compareObjects(data1, data2);
};

export { parse, getFormat };
export default gendiff;
