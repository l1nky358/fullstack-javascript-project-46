const stringify = (value, depth) => {
  if (typeof value !== 'object' || value === null) {
    return String(value);
  }

  const indentSize = 4;
  const currentIndent = ' '.repeat(depth * indentSize);
  const bracketIndent = ' '.repeat((depth - 1) * indentSize);
  
  const entries = Object.entries(value);
  const lines = entries.map(([key, val]) => {
    const formattedValue = stringify(val, depth + 1);
    return `${currentIndent}${key}: ${formattedValue}`;
  });

  return `{\n${lines.join('\n')}\n${bracketIndent}}`;
};

const stylish = (tree) => {
  const iter = (nodes, depth) => {
    const indentSize = 4;
    const indent = ' '.repeat(depth * indentSize);
    const lines = nodes.map((node) => {
      const { key, type } = node;
      
      switch (type) {
        case 'nested':
          return `${indent}    ${key}: {\n${iter(node.children, depth + 1)}\n${indent}    }`;
        
        case 'added':
          return `${indent}  + ${key}: ${stringify(node.value, depth + 1)}`;
        
        case 'removed':
          return `${indent}  - ${key}: ${stringify(node.value, depth + 1)}`;
        
        case 'changed': {
          const oldValue = stringify(node.oldValue, depth + 1);
          const newValue = stringify(node.value, depth + 1);
          return `${indent}  - ${key}: ${oldValue}\n${indent}  + ${key}: ${newValue}`;
        }
        
        case 'unchanged':
          return `${indent}    ${key}: ${stringify(node.value, depth + 1)}`;
        
        default:
          throw new Error(`Unknown type: ${type}`);
      }
    });

    return lines.join('\n');
  };

  return `{\n${iter(tree, 1)}\n}`;
};

export default stylish;
