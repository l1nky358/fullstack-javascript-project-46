const formatPlain = diff => {
  const iter = (node, path = '') => {
    const lines = node.flatMap(item => {
      const currentPath = path ? `${path}.${item.key}` : item.key
      
      switch (item.type) {
        case 'added':
          return `Property '${currentPath}' was added with value: ${formatValue(item.value)}`
        case 'removed':
          return `Property '${currentPath}' was removed`
        case 'changed':
          return `Property '${currentPath}' was updated. From ${formatValue(item.oldValue)} to ${formatValue(item.newValue)}`
        case 'nested':
          return iter(item.children, currentPath)
        case 'unchanged':
          return []
        default:
          throw new Error(`Unknown type: ${item.type}`)
      }
    })
    
    return lines.join('\n')
  }
  
  return iter(diff)
}

const formatValue = value => {
  if (value === null) {
    return 'null'
  }
  
  if (typeof value === 'object') {
    return '[complex value]'
  }
  
  if (typeof value === 'string') {
    return `'${value}'`
  }
  
  return value
}

export default formatPlain
