import { readFileSync } from 'fs'
import path from 'path'
import yaml from 'js-yaml'

const parsers = {
  json: content => JSON.parse(content),
  yml: content => yaml.load(content),
  yaml: content => yaml.load(content),
}

const getParser = (filepath) => {
  const ext = path.extname(filepath).slice(1).toLowerCase()
  return parsers[ext]
}

export const parseFile = (filepath) => {
  const content = readFileSync(filepath, 'utf-8')
  const parser = getParser(filepath)

  if (!parser) {
    throw new Error(`Unsupported file format: ${filepath}`)
  }

  return parser(content)
}

export default parseFile
