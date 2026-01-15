import fs from 'fs';
import yaml from 'yaml';

const parse = (content, format) => {
  if (format === 'json') {
    return JSON.parse(content);
  }
  if (format === 'yml' || format === 'yaml') {
    return yaml.parse(content);
  }
  throw new Error(`Unsupported format: ${format}`);
};

export default parse;
