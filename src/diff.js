const buildDiff = (data1, data2) => {
  const keys = new Set([...Object.keys(data1), ...Object.keys(data2)]);
  const sortedKeys = Array.from(keys).sort();

  return sortedKeys.map((key) => {
    const value1 = data1[key];
    const value2 = data2[key];

    if (!(key in data1)) {
      return { key, value: value2, type: 'added' };
    }
    
    if (!(key in data2)) {
      return { key, value: value1, type: 'removed' };
    }
    
    if (value1 === value2) {
      return { key, value: value1, type: 'unchanged' };
    }
    
    return { 
      key, 
      oldValue: value1, 
      value: value2, 
      type: 'changed' 
    };
  });
};

export const formatDiff = (diff) => {
  const lines = diff.map((item) => {
    switch (item.type) {
      case 'added':
        return `  + ${item.key}: ${item.value}`;
      case 'removed':
        return `  - ${item.key}: ${item.value}`;
      case 'changed':
        return `  - ${item.key}: ${item.oldValue}\n  + ${item.key}: ${item.value}`;
      case 'unchanged':
        return `    ${item.key}: ${item.value}`;
      default:
        return '';
    }
  });

  return `{\n${lines.join('\n')}\n}`;
};

export default buildDiff;