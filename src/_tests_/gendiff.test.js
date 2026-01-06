import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import gendiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => join(__dirname, '..', '__fixtures__', filename);

test('gendiff flat JSON files', () => {
  const file1 = getFixturePath('file1.json');
  const file2 = getFixturePath('file2.json');
  const expected = readFileSync(getFixturePath('expected.txt'), 'utf-8');
  expect(gendiff(file1, file2)).toBe(expected);
});

test('gendiff flat YAML files', () => {
  const file1 = getFixturePath('file1.yml');
  const file2 = getFixturePath('file2.yml');
  const expected = readFileSync(getFixturePath('expected.txt'), 'utf-8');
  expect(gendiff(file1, file2)).toBe(expected);
});

test('gendiff flat YML files', () => {
  const file1 = getFixturePath('file1.yaml');
  const file2 = getFixturePath('file2.yaml');
  const expected = readFileSync(getFixturePath('expected.txt'), 'utf-8');
  expect(gendiff(file1, file2)).toBe(expected);
});