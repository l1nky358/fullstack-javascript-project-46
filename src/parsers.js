import fs from 'fs';

const getFileContent = (filePath) => {
  return fs.readFileSync(filePath, 'utf-8');
};

const parse = (content, format) => {
  if (format === 'json') {
    return JSON.parse(content);
  }
  throw new Error(`Unsupported format: ${format}`);
};

const getData = (filePath) => {
  const content = getFileContent(filePath);
  const format = filePath.split('.').pop().toLowerCase();
  return parse(content, format);
};

export default getData;