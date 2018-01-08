'use strict'

const validator = require('validator'),
  _ = require('lodash'),
  moment = require('moment')

const supportedSanitizer = ['blacklist', 'escape', 'ltrim', 'normalizeEmail', 'rtrim', 'stripLow',
  'trim', 'whitelist']

let sanitizer = {}
_.each(supportedSanitizer, v => {
  sanitizer[v] = validator[v]
})

sanitizer.toDatetime = function (value, format) {
  return moment(value).format(format)
}

sanitizer.toDate = function (value) {
  return moment(value).format(format)
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

const supported = _.keys(sanitizer)

function checkField (field, value) {
  let err = [], result = value + ''
  _.forOwn(_.cloneDeep(field.sanitizer), (v, k) => {
    if (supported.indexOf(k) === -1) 
      return
    if (_.isFunction(sanitizer[k])) {
      let args
      if (_.isArray(v))
        args = [result, ...v]
      else
        args = v === true ? [result] : [result, v]
      result = sanitizer[k](...args)
    }
  })
  return result
}

function sanitize (body, fields) {
  _.forOwn(fields, (f, id) => {
    if (body[id] === null || (!_.has(body, id)))
      return
    let result = checkField(f, body[id])
    if (result !== undefined)
      body[id] = result
  })
  return body
}


module.exports = {
  sanitize: sanitize,
  sanitizer: sanitizer,
  sanitizers: supported
}