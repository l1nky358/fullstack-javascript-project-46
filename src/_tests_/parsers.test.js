import getData from '../parsers.js';

describe('parsers', () => {
  test('should parse JSON file correctly', () => {
    const filePath = '__fixtures__/file1.json';
    const data = getData(filePath);
    
    expect(data).toEqual({
      host: 'hexlet.io',
      timeout: 50,
      proxy: '123.234.53.22',
      follow: false
    });
  });
  
  test('should throw error for unsupported format', () => {
    const filePath = 'test.txt';
    
    expect(() => getData(filePath)).toThrow('Unsupported format: txt');
  });
});