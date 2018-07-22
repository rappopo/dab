'use strict'

const validatorJs = require('validator'),
  _ = require('lodash'),
  moment = require('moment')

moment.suppressDeprecationWarnings = true

const supportedValidatorJs = ['required', 'contains', 'equals', 'isAfter', 'isAlpha', 'isAlphanumeric', 'isAscii',
  'isBase64', 'isBefore', 'isBoolean', 'isByteLength', 'isCreditCard', 'isCurrency', 'isDataURI', 'isDecimal',
  'isDivisibleBy', 'isEmail', 'isFQDN', 'isFloat', 'isFloat', 'isFullWidth', 'isHalfWidth', 'isHash', 'isHexColor',
  'isHexadecimal', 'isIP', 'isIPRange', 'isISBN', 'isISSN', 'isISIN', 'isISO8601', 'isISO31661Alpha2', 'isISO31661Alpha3',
  'isISRC', 'isIn', 'isInt', 'isJSON', 'isLatLong', 'isLength', 'isLowercase', 'isMACAddress', 'isMD5', 'isMimeType',
  'isMobilePhone', 'isMongoId', 'isMultibyte', 'isNumeric', 'isPort', 'isPostalCode', 'isSurrogatePair',
  'isURL', 'isUUID', 'isUppercase', 'isVariableWidth', 'isWhitelisted', 'matches']

let validator = {}
_.each(supportedValidatorJs, v => {
  validator[v] = validatorJs[v]
})

validator.required = function (value) {
  return !_.isEmpty(value)
}

validator.isDate = function (value, format) {
  return moment(value, format).isValid()
}

validator.isDatetime = function (value, format) {
  return moment(value, format).isValid()
}

validator.isObject = function (value) {
  try {
    let val = JSON.parse(value)
    return _.isPlainObject(val)
  } catch (e) {
    return false
  }
}

validator.isArray = function (value) {
  try {
    let val = JSON.parse(value)
    return _.isArray(val)
  } catch (e) {
    return false
  }
}

validator.isAfter = function (value, dt, format) {
  if (!dt)
    return validatorJs.isAfter(value)
  let m = _.isEmpty(format) ? moment(dt) : moment(dt, format)
  if (!m.isValid()) return false
  return validatorJs.isAfter(value, m.toDate())
}

validator.isBefore = function (value, dt, format) {
  if (!dt)
    return validatorJs.isBefore(value)
  let m = _.isEmpty(format) ? moment(dt) : moment(dt, format)
  if (!m.isValid()) return false
  return validatorJs.isBefore(value, m.toDate())
}

const supported = _.keys(validator)

function checkField (field, value) {
  if (value === undefined || value === null)
    value = ''
  if (['object', 'array'].indexOf(field.type) > -1)
    value = JSON.stringify(value)
  else
    value = value + ''
  let err = []
  _.forOwn(_.cloneDeep(field.validator), (v, k) => {
    let result = true
    if (supported.indexOf(k) === -1)
      return
    if (_.isFunction(validator[k])) {
      let args
      if (_.isArray(v))
        args = [value, ...v]
      else
        args = v === true ? [value] : [value, v]
      result = validator[k](...args)
    }
    if (!result)
      err.push(k)
  })
  return err
}

function validate (body, fields, ignored = []) {
  let err = {}
  _.forOwn(fields, (f, id) => {
    if (ignored.indexOf(id) > -1)
      return
    let result
    if (f.validator.required || _.has(body, id))
      result = checkField(f, body[id])
    if (!_.isEmpty(result))
      err[id] = result
  })
  return _.isEmpty(err) ? null : err
}


module.exports = {
  validate: validate,
  validator: validator,
  validators: supported
}