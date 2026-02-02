import formatStylish from '../formatters/stylish.js'
import formatPlain from '../formatters/plain.js'
import formatJson from '../formatters/json.js'

const formatters = {
  stylish: formatStylish,
  plain: formatPlain,
  json: formatJson,
}

export default (formatName) => {
  const formatter = formatters[formatName]

  if (!formatter) {
    throw new Error(`Unknown format: ${formatName}`)
  }

  return formatter
}
