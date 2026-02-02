const isObject = (value) =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const buildTree = (data1, data2) => {
  const keys = new Set([...Object.keys(data1), ...Object.keys(data2)])
  const sortedKeys = Array.from(keys).sort()

  return sortedKeys.map((key) => {
    const value1 = data1[key]
    const value2 = data2[key]

    if (!(key in data1)) {
      return {
        key,
        value: value2,
        type: 'added',
        children: isObject(value2) ? buildTree({}, value2) : [],
      }
    }
    
    if (!(key in data2)) {
      return {
        key,
        value: value1,
        type: 'removed',
        children: isObject(value1) ? buildTree(value1, {}) : [],
      }
    }
    
    if (isObject(value1) && isObject(value2)) {
      return {
        key,
        type: 'nested',
        children: buildTree(value1, value2),
      }
    }
    
    if (value1 === value2) {
      return {
        key,
        value: value1,
        type: 'unchanged',
      }
    }
    
    return {
      key,
      oldValue: value1,
      value: value2,
      type: 'changed',
    }
  })
}

export default buildTree
