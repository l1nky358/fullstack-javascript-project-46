import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

describe('Formatters', () => {
  describe('json formatter', () => {
    test('json formatter with flat files', () => {
      const filepath1 = getFixturePath('file1.json');
      const filepath2 = getFixturePath('file2.json');
      
      const result = genDiff(filepath1, filepath2, 'json');
      
      expect(() => JSON.parse(result)).not.toThrow();
      
      const parsedResult = JSON.parse(result);
      expect(Array.isArray(parsedResult)).toBe(true);
      
      expect(parsedResult[0]).toMatchObject({
        key: 'common',
        type: 'nested',
        children: expect.any(Array),
      });
    });

    test('json formatter with nested structures', () => {
      const filepath1 = getFixturePath('nested1.json');
      const filepath2 = getFixturePath('nested2.json');
      
      const result = genDiff(filepath1, filepath2, 'json');
      expect(() => JSON.parse(result)).not.toThrow();
      
      const parsedResult = JSON.parse(result);
      
      expect(Array.isArray(parsedResult)).toBe(true);
      
      parsedResult.forEach((node) => {
        expect(node).toHaveProperty('key');
        expect(node).toHaveProperty('type');
        expect(['added', 'removed', 'changed', 'unchanged', 'nested']).toContain(node.type);
        
        if (node.type === 'nested') {
          expect(node).toHaveProperty('children');
          expect(Array.isArray(node.children)).toBe(true);
        }
        
        if (node.type === 'changed') {
          expect(node).toHaveProperty('oldValue');
          expect(node).toHaveProperty('newValue');
        }
        
        if (node.type === 'added' || node.type === 'unchanged') {
          expect(node).toHaveProperty('value');
        }
        
        if (node.type === 'removed') {
          expect(node).toHaveProperty('value');
        }
      });
    });

    test('all formatters produce different output', () => {
      const filepath1 = getFixturePath('file1.json');
      const filepath2 = getFixturePath('file2.json');
      
      const stylishResult = genDiff(filepath1, filepath2, 'stylish');
      const plainResult = genDiff(filepath1, filepath2, 'plain');
      const jsonResult = genDiff(filepath1, filepath2, 'json');
      
      expect(stylishResult).not.toBe(plainResult);
      expect(stylishResult).not.toBe(jsonResult);
      expect(plainResult).not.toBe(jsonResult);
      
      expect(['[', '{']).toContain(jsonResult.trim()[0]);
    });
  });
});