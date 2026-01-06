import fs from 'fs';

const compareJsonFiles = async (filePath1, filePath2) => {
  const json1 = JSON.parse(await fs.readFile(filePath1, 'utf8'));
  const json2 = JSON.parse(await fs.readFile(filePath2, 'utf8'));
  return JSON.stringify(json1) === JSON.stringify(json2);
};

test('сравнение двух одинаковых json-файлов', async () => {
  const result = await compareJsonFiles('./__fixtures__/file1.json', './__fixtures__/file2.json');
  expect(result).toBe(true);
});

test('сравнение двух разных json-файлов', async () => {
  const result = await compareJsonFiles('./__fixtures__/file1.json', './__fixtures__/file3.json');
  expect(result).toBe(false);
});