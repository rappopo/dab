'use strict'

const _ = require('lodash'),
  validation = require('./validation'),
  sanitization = require('./sanitization')

class DabCollection {
  constructor (options) {
    options = options || {}
    this.name = null
    this.attribId = null
    this.attribName = null
    this.order = []
    this.fields = []
    this.setOptions(options)
  }

  setOptions (options) {
    options = options || {}
    if (_.isEmpty(options.name))
      throw new Error('Requires a name')
    this.name = options.name
    this.attribId = options.attribId || '_id'
    this.attribName = options.attribName || 'collection'
    const supported = ['string', 'integer', 'float', 'boolean', 'date', 'datetime', 'text']
    _.each(options.fields, f => {
      if (typeof f !== 'object') return
      if (_.isEmpty(f.id)) return
      if (supported.indexOf(f.type) === -1) return
      let field = {
        id: f.id,
        type: f.type,
        hidden: f.hidden ? true : false,
        sanitizer: f.sanitizer || {},
        validator: f.validator || {}
      }
      if (typeof f.mask === 'string' && !_.isEmpty(f.mask))
        field.mask = f.mask
      switch(f.type) {
        case 'string': 
          field.length = parseInt(f.length) || 255
          if (typeof f.default === 'string')
            field.default = f.default
          break
        case 'text': 
          if (typeof f.default === 'string')
            field.default = f.default
          break
        case 'integer':
          if (!_.has(field.validator, 'isInteger'))
            field.validator.isInteger = true
          if (!_.has(field.sanitizer, 'toInteger'))
            field.sanitizer.toInteger = true
          if (typeof f.default === 'number')
            field.default = Math.round(f.default)
          break
        case 'float':
          if (!_.has(field.validator, 'isFloat'))
            field.validator.isFloat = true
          if (!_.has(field.sanitizer, 'toFloat'))
            field.sanitizer.toFloat = true
          if (typeof f.default === 'number')
            field.default = f.default
          break
        case 'boolean':
          if (!_.has(field.validator, 'isBoolean'))
            field.validator.isBoolean = true
          if (!_.has(field.sanitizer, 'toBoolean'))
            field.sanitizer.toBoolean = true
          if (typeof f.default === 'boolean')
            field.default = f.default
          break
        case 'date': 
          if (!_.has(field.validator, 'isDate'))
            field.validator.isDate = true
          if (!_.has(field.sanitizer, 'toDate'))
            field.sanitizer.toDate = true
          if (typeof f.default === 'string' && !_.isEmpty(f.default))
            field.default = f.default
          break
        case 'datetime': 
          if (!_.has(field.validator, 'isDatetime'))
            field.validator.isDatetime = true
          if (!_.has(field.sanitizer, 'toDatetime'))
            field.sanitizer.toDatetime = true
          if (typeof f.default === 'string' && !_.isEmpty(f.default))
            field.default = f.default
          break
      }
      this.fields.push(field)
    })
    const keys = _.map(this.fields, 'id')
    this.order = options.order || keys
    _.each(this.order, (k, i) => {
      if (keys.indexOf(k) === -1)
        _.pullAt(this.order, i)
    })
    return this
  }  

  convertDoc (doc) {
    if (_.isEmpty(this.fields)) return doc
    let newDoc = {}
    _.each(this.order, o => {
      let field = _.find(this.fields, { id: o })
      if (field && !field.hidden) 
        newDoc[field.mask || o] = doc[o] || null
    })
    return newDoc
  }

  sanitizeDoc (doc, skipped = false) {
    if (_.isEmpty(this.fields)) return doc
    doc = doc || {}
    let newDoc = _.cloneDeep(doc)
    // reverted to its mask
    _.each(this.fields, (f, i) => {
      if (f.mask && _.has(newDoc, f.mask)) {
        newDoc[f.id] = newDoc[f.mask]
        delete newDoc[f.mask]
      }
    })
    if (!skipped)
      newDoc = sanitization.sanitize(newDoc, this.fields)
    return newDoc
  }

  validateDoc (doc, ignored = []) {
    let result = validation.validate(doc, this.fields, ignored)
    if (!_.isEmpty(result)) {
      let err = new Error('Validation error')
      err.details = result
      return err
    }
    return null
  }

}

module.exports = DabCollection