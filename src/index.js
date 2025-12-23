import getData from './parsers.js';

const genDiff = (filePath1, filePath2) => {
  const data1 = getData(filePath1);
  const data2 = getData(filePath2);
  
  return { data1, data2 };
};

export default genDiff;