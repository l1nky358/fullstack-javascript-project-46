import path from 'path'
import fs from 'fs'
import yaml from 'yaml'

const getFormat = (filepath) => {
  const ext = path.extname(filepath).toLowerCase()
  if (ext === '.json') return 'json'
  if (ext === '.yml' || ext === '.yaml') return 'yml'
  throw new Error(`Unsupported format: ${filepath}`)
}

const parse = (content, format) => {
  if (format === 'json') {
    return JSON.parse(content)
  }
  if (format === 'yml') {
    return yaml.parse(content)
  }
  throw new Error(`Unsupported format: ${format}`)
}

const isObject = (value) => typeof value === 'object' && value !== null && !Array.isArray(value)

const buildTree = (obj1, obj2) => {
  const keys1 = Object.keys(obj1 || {})
  const keys2 = Object.keys(obj2 || {})
  const allKeys = [...new Set([...keys1, ...keys2])]
  const sortedKeys = allKeys.sort()
  const result = {}
  for (const key of sortedKeys) {
    const value1 = obj1?.[key]
    const value2 = obj2?.[key]
    
    if (!(key in (obj1 || {}))) {
      result[key] = { type: 'added', value: value2 }
    }
    else if (!(key in (obj2 || {}))) {
      result[key] = { type: 'removed', value: value1 }
    }
    else if (isObject(value1) && isObject(value2)) {
      result[key] = { type: 'nested', children: buildTree(value1, value2) }
    }
    else if (JSON.stringify(value1) === JSON.stringify(value2)) {
      result[key] = { type: 'unchanged', value: value1 }
    }
    else {
      result[key] = { type: 'changed', oldValue: value1, newValue: value2 }
    }
  }
  
  return result
}

const formatStylish = (tree, depth = 1) => {
  const indent = ' '.repeat(4 * depth)
  const bracketIndent = ' '.repeat(4 * (depth - 1))
  
  const sortedKeys = Object.keys(tree).sort()
  
  const lines = sortedKeys.flatMap((key) => {
  const node = tree[key]
  const { type } = node
    
    if (type === 'nested') {
    const children = formatStylish(node.children, depth + 1)
    return `${indent.slice(0, -2)}  ${key}: ${children}`
    }
    
    if (type === 'added') {
    const value = formatStylishValue(node.value, depth + 1)
      return `${indent.slice(0, -2)}+ ${key}: ${value}`
    }
    
    if (type === 'removed') {
      const value = formatStylishValue(node.value, depth + 1)
      return `${indent.slice(0, -2)}- ${key}: ${value}`
    }
    
    if (type === 'changed') {
    const oldValue = formatStylishValue(node.oldValue, depth + 1)
      const newValue = formatStylishValue(node.newValue, depth + 1)
      return [
        `${indent.slice(0, -2)}- ${key}: ${oldValue}`,
        `${indent.slice(0, -2)}+ ${key}: ${newValue}`,
      ]
    }
    
    const value = formatStylishValue(node.value, depth + 1)
    return `${indent.slice(0, -2)}  ${key}: ${value}`
  })
  
  return `{\n${lines.join('\n')}\n${bracketIndent}}`
}

const formatStylishValue = (value, depth) => {
  if (isObject(value)) {
    const indent = ' '.repeat(4 * depth)
    const bracketIndent = ' '.repeat(4 * (depth - 1))
    
    const keys = Object.keys(value).sort()
    const lines = keys.map((key) => {
      const val = value[key]
      const formatted = formatStylishValue(val, depth + 1)
      return `${indent.slice(0, -2)}  ${key}: ${formatted}`
    })
    
    return `{\n${lines.join('\n')}\n${bracketIndent}}`
  }
  
  if (value === null) return 'null'
  if (typeof value === 'boolean') return String(value)
  return value
}

const formatPlain = (tree, path = '') => {
  const sortedKeys = Object.keys(tree).sort()
  
  const lines = sortedKeys.flatMap((key) => {
    const node = tree[key]
    const currentPath = path ? `${path}.${key}` : key
    const { type } = node
    
    if (type === 'nested') {
      return formatPlain(node.children, currentPath)
    }
    
    if (type === 'added') {
      const formattedValue = formatPlainValue(node.value)
      return `Property '${currentPath}' was added with value: ${formattedValue}`
    }
    
    if (type === 'removed') {
      return `Property '${currentPath}' was removed`
    }
    
    if (type === 'changed') {
      const formattedOld = formatPlainValue(node.oldValue)
      const formattedNew = formatPlainValue(node.newValue)
      return `Property '${currentPath}' was updated. From ${formattedOld} to ${formattedNew}`
    }
    
    return []
  })
  
  return lines.join('\n')
}

const formatPlainValue = (value) => {
  if (isObject(value)) {
    return '[complex value]'
  }
  
  if (typeof value === 'string') {
    return `'${value}'`
  }
  
  if (value === null) return 'null'
  return String(value)
}

const gendiff = (filepath1, filepath2, outputFormat = 'stylish') => {
  const content1 = fs.readFileSync(filepath1, 'utf-8')
  const content2 = fs.readFileSync(filepath2, 'utf-8')
  
  const format1 = getFormat(filepath1)
  const format2 = getFormat(filepath2)
  
  const data1 = parse(content1, format1)
  const data2 = parse(content2, format2)
  
  const tree = buildTree(data1, data2)
  
  if (outputFormat === 'stylish') {
    return formatStylish(tree)
  }
  
  if (outputFormat === 'plain') {
    return formatPlain(tree)
  }
  
  if (outputFormat === 'json') {
    return JSON.stringify(tree, null, 2)
  }
  
  throw new Error(`Unknown format: ${outputFormat}`)
}

export { parse, getFormat }
export default gendiff
