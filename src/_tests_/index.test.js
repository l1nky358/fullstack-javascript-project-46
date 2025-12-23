import genDiff from '../src/index.js';

describe('genDiff', () => {
  test('should parse two JSON files', () => {
    const filePath1 = '__fixtures__/file1.json';
    const filePath2 = '__fixtures__/file2.json';
    
    const result = genDiff(filePath1, filePath2);
    
    expect(result.data1).toEqual({
      host: 'hexlet.io',
      timeout: 50,
      proxy: '123.234.53.22',
      follow: false
    });
    
    expect(result.data2).toEqual({
      timeout: 20,
      verbose: true,
      host: 'hexlet.io'
    });
  });
});