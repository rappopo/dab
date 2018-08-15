'use strict'

const validator = require('validator')
const _ = require('lodash')
const moment = require('moment')

moment.suppressDeprecationWarnings = true

const supportedSanitizer = ['blacklist', 'escape', 'ltrim', 'normalizeEmail', 'rtrim', 'stripLow',
  'trim', 'whitelist']

let sanitizer = {}
_.each(supportedSanitizer, v => {
  sanitizer[v] = validator[v]
})

sanitizer.toDatetime = function (value, format) {
  let m = _.isEmpty(format) ? moment(value) : moment(value, format)
  if (!m.isValid) return null
  return m.toISOString()
}

sanitizer.toDate = function (value, format) {
  let m = _.isEmpty(format) ? moment(value) : moment(value, format)
  if (!m.isValid) return null
  return m.toISOString().substr(0, 10)
}

sanitizer.toBoolean = function (value) {
  return validator.toBoolean(value)
}

sanitizer.toFloat = function (value) {
  return validator.toFloat(value) || null
}

sanitizer.toInteger = function (value) {
  return validator.toInt(value) || null
}

sanitizer.toString = function (value) {
  return value + ''
}

sanitizer.toObject = function (value) {
  if (_.isPlainObject(value)) return value
  try {
    return JSON.parse(value)
  } catch (e) {
    return null
  }
}

sanitizer.toArray = function (value) {
  if (_.isArray(value)) return value
  try {
    return JSON.parse(value)
  } catch (e) {
    return null
  }
}

const supported = _.keys(sanitizer)

function checkField (field, value) {
  let result = null
  if (value === undefined || value === null) return null
  if (['object', 'array'].indexOf(field.type) > -1) {
    result = typeof value === 'string' ? value : JSON.stringify(value)
  } else {
    result = value + ''
  }
  _.forOwn(_.cloneDeep(field.sanitizer), (v, k) => {
    if (supported.indexOf(k) === -1) return
    if (_.isFunction(sanitizer[k])) {
      let args
      if (_.isArray(v))args = [result, ...v]
      else args = v === true ? [result] : [result, v]
      result = sanitizer[k](...args)
    }
  })
  return result
}

function sanitize (body, fields) {
  _.forOwn(fields, (f, id) => {
    if (body[id] === null || (!_.has(body, id))) return
    let result = checkField(f, body[id])
    if (result !== undefined) body[id] = result
  })
  return body
}

module.exports = {
  sanitize: sanitize,
  sanitizer: sanitizer,
  sanitizers: supported
}
