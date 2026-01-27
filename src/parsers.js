import path from 'path'
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

export { getFormat, parse }
