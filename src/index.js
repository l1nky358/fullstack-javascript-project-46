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

const isObject = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);

const buildTree = (obj1, obj2) => {
  const allKeys = new Set([...Object.keys(obj1 || {}), ...Object.keys(obj2 || {})]);
  const result = {};
  
  for (const key of allKeys) {
    const value1 = obj1?.[key];
    const value2 = obj2?.[key];
    
    if (!(key in obj1)) {
      result[key] = { type: 'added', value: value2 };
    } else if (!(key in obj2)) {
      result[key] = { type: 'removed', value: value1 };
    } else if (isObject(value1) && isObject(value2)) {
      result[key] = { type: 'nested', children: buildTree(value1, value2) };
    } else if (value1 === value2) {
      result[key] = { type: 'unchanged', value: value1 };
    } else {
      result[key] = { type: 'changed', oldValue: value1, newValue: value2 };
    }
  }
  
  return result;
};

const formatStylish = (tree, depth = 1) => {
  const indent = '  '.repeat(depth * 2 - 2);
  const bracketIndent = '  '.repeat(depth * 2 - 4);
  
  const lines = Object.entries(tree).map(([key, node]) => {
    const { type } = node;
    
    if (type === 'nested') {
      return `${indent}  ${key}: ${formatStylish(node.children, depth + 1)}`;
    }
    
    const valueIndent = `${indent}  `;
    
    if (type === 'added') {
      return `${indent}+ ${key}: ${formatValue(node.value, depth + 1)}`;
    }
    
    if (type === 'removed') {
      return `${indent}- ${key}: ${formatValue(node.value, depth + 1)}`;
    }
    
    if (type === 'changed') {
      return [
        `${indent}- ${key}: ${formatValue(node.oldValue, depth + 1)}`,
        `${indent}+ ${key}: ${formatValue(node.newValue, depth + 1)}`
      ].join('\n');
    }
    
    return `${indent}  ${key}: ${formatValue(node.value, depth + 1)}`;
  });
  
  return `{\n${lines.join('\n')}\n${bracketIndent}}`;
};

const formatValue = (value, depth) => {
  if (typeof value === 'object' && value !== null) {
    const indent = '  '.repeat(depth * 2);
    const bracketIndent = '  '.repeat(depth * 2 - 2);
    
    const lines = Object.entries(value).map(([key, val]) => {
      return `${indent}  ${key}: ${formatValue(val, depth + 1)}`;
    });
    
    return `{\n${lines.join('\n')}\n${bracketIndent}}`;
  }
  
  if (value === null) return 'null';
  if (value === undefined) return '';
  return String(value);
};

const formatPlain = (tree, path = '') => {
  const lines = Object.entries(tree).flatMap(([key, node]) => {
    const currentPath = path ? `${path}.${key}` : key;
    const { type } = node;
    
    if (type === 'nested') {
      return formatPlain(node.children, currentPath);
    }
    
    if (type === 'added') {
      const formattedValue = formatPlainValue(node.value);
      return `Property '${currentPath}' was added with value: ${formattedValue}`;
    }
    
    if (type === 'removed') {
      return `Property '${currentPath}' was removed`;
    }
    
    if (type === 'changed') {
      const formattedOld = formatPlainValue(node.oldValue);
      const formattedNew = formatPlainValue(node.newValue);
      return `Property '${currentPath}' was updated. From ${formattedOld} to ${formattedNew}`;
    }
    
    return [];
  });
  
  return lines.join('\n');
};

const formatPlainValue = (value) => {
  if (typeof value === 'object' && value !== null) {
    return '[complex value]';
  }
  
  if (typeof value === 'string') {
    return `'${value}'`;
  }
  
  if (value === null) return 'null';
  return String(value);
};

const gendiff = (filepath1, filepath2, outputFormat = 'stylish') => {
  const content1 = fs.readFileSync(filepath1, 'utf-8');
  const content2 = fs.readFileSync(filepath2, 'utf-8');
  
  const format1 = getFormat(filepath1);
  const format2 = getFormat(filepath2);
  
  const data1 = parse(content1, format1);
  const data2 = parse(content2, format2);
  
  const tree = buildTree(data1, data2);
  
  if (outputFormat === 'stylish') {
    return formatStylish(tree);
  }
  
  if (outputFormat === 'plain') {
    return formatPlain(tree);
  }
  
  if (outputFormat === 'json') {
    return JSON.stringify(tree, null, 2);
  }
  
  throw new Error(`Unknown format: ${outputFormat}`);
};

export { parse, getFormat };
export default gendiff;
