import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

test('plain formatter', () => {
  const filepath1 = getFixturePath('file1.json');
  const filepath2 = getFixturePath('file2.json');
  
  const result = genDiff(filepath1, filepath2, 'plain');
  const expected = fs.readFileSync(getFixturePath('expected-plain.txt'), 'utf-8').trim();
  
  expect(result).toBe(expected);
});

test('plain formatter with nested structures', () => {
  const filepath1 = getFixturePath('nested1.json');
  const filepath2 = getFixturePath('nested2.json');
  
  const result = genDiff(filepath1, filepath2, 'plain');
  const expected = fs.readFileSync(getFixturePath('expected-nested-plain.txt'), 'utf-8').trim();
  
  expect(result).toBe(expected);
});