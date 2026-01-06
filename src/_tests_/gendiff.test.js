import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import gendiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => join(__dirname, '..', '__fixtures__', filename);
const readFixture = (filename) => readFileSync(getFixturePath(filename), 'utf-8');

describe('gendiff', () => {
  test('stylish format for nested JSON', () => {
    const file1 = getFixturePath('file1.json');
    const file2 = getFixturePath('file2.json');
    const expected = readFixture('expected_stylish.txt');
    expect(gendiff(file1, file2)).toBe(expected);
  });

  test('stylish format for nested YAML', () => {
    const file1 = getFixturePath('file1.yml');
    const file2 = getFixturePath('file2.yml');
    const expected = readFixture('expected_stylish.txt');
    expect(gendiff(file1, file2)).toBe(expected);
  });

  test('stylish format default', () => {
    const file1 = getFixturePath('file1.json');
    const file2 = getFixturePath('file2.json');
    const expected = readFixture('expected_stylish.txt');
    expect(gendiff(file1, file2)).toBe(expected);
  });
});