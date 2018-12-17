'use strict'

const _ = require('lodash')
const validation = require('./validation')
const sanitization = require('./sanitization')

function setFieldDef (field, type) {
  let checker = _.upperFirst(type)
  if (!_.has(field.validator, 'is' + checker)) field.validator['is' + checker] = true
  if (!_.has(field.sanitizer, 'to' + checker)) field.sanitizer['to' + checker] = true
  return field
}

class DabCollection {
  constructor (options) {
    options = options || {}
    this.name = null
    this.srcAttribId = null
    this.srcAttribIdType = null
    this.srcAttribName = null
    this.order = []
    this.attributes = {}
    this.indexes = {}
    this.setOptions(options)
  }

  setOptions (options) {
    options = options || {}
    if (_.isEmpty(options.name)) throw new Error('Requires a name')
    this.name = options.name
    this.srcAttribId = options.srcAttribId || '_id'
    this.srcAttribIdType = options.srcAttribIdType || 'string'
    this.srcAttribName = options.srcAttribName || 'collection'
    if (_.isEmpty(options.attributes)) return this
    const supported = ['string', 'integer', 'float', 'boolean', 'date', 'datetime', 'text', 'object', 'array']
    if (!_.has(options.attributes, this.srcAttribId)) {
      options.attributes[this.srcAttribId] = {
        type: this.srcAttribIdType,
        primaryKey: true
      }
    }
    let hasPK = false
    _.forOwn(options.attributes, (f, id) => {
      if (typeof f === 'string') f = { type: f }
      if (!_.isPlainObject(f)) return
      if (supported.indexOf(f.type) === -1) return
      let field = {
        type: f.type,
        hidden: f.hidden,
        sanitizer: f.sanitizer || {},
        validator: f.validator || {}
      }
      if (f.primaryKey) {
        if (hasPK) throw new Error('Already has primary key')
        hasPK = true
        field.primaryKey = true
      }
      if (typeof f.mask === 'string' && !_.isEmpty(f.mask)) field.mask = f.mask
      switch (f.type) {
        case 'string':
          field.length = parseInt(f.length) || 255
          if (typeof f.default === 'string') field.default = f.default
          break
        case 'text':
          if (typeof f.default === 'string') field.default = f.default
          break
        case 'integer':
          field = setFieldDef(field, f.type)
          if (typeof f.default === 'number') field.default = Math.round(f.default)
          break
        case 'float':
          field = setFieldDef(field, f.type)
          if (typeof f.default === 'number') field.default = f.default
          break
        case 'boolean':
          field = setFieldDef(field, f.type)
          if (typeof f.default === 'boolean') field.default = f.default
          break
        case 'datetime':
        case 'date':
          field = setFieldDef(field, f.type)
          if (typeof f.default === 'string' && !_.isEmpty(f.default)) field.default = f.default
          break
        default:
          field = setFieldDef(field, f.type)
      }
      this.attributes[id] = field
    })
    const keys = _.keys(this.attributes)
    this.order = options.order || keys
    _.each(this.order, (k, i) => {
      if (keys.indexOf(k) === -1) _.pullAt(this.order, i)
    })
    if (_.isArray(options.indexes)) {
      let idx = {}
      _.each(options.indexes, i => {
        if (keys.indexOf(i) === -1) return
        idx[i] = true
      })
      options.indexes = idx
    }
    _.forOwn(options.indexes, (i, id) => {
      if (keys.indexOf(id) > -1 && i === true) {
        this.indexes[id] = {
          column: [id],
          unique: false
        }
        return
      }
      let idx = {
        column: _.isArray(i.column) ? i.column : [i.column],
        unique: i.unique === true
      }
      let pos = []
      _.each(idx.column, (c, ix) => {
        if (keys.indexOf(c) === -1) pos.push(ix)
      })
      if (pos.length > 0) _.pullAt(idx.column, pos)
      this.indexes[id] = idx
    })
    return this
  }

  convertDoc (doc, skipSanitize = false) {
    if (_.isEmpty(this.attributes)) return doc
    let newDoc = {}
    _.each(this.order, o => {
      let field = this.attributes[o]
      if (field && !field.hidden) newDoc[field.mask || o] = doc[o] || null
    })
    if (!skipSanitize) newDoc = sanitization.sanitize(newDoc, this.attributes)
    return newDoc
  }

  sanitizeDoc (doc, skipped = false) {
    if (_.isEmpty(this.attributes)) return doc
    doc = doc || {}
    let newDoc = _.cloneDeep(doc)
    // reverted to its mask
    _.forOwn(this.attributes, (f, id) => {
      if (f.mask && _.has(newDoc, f.mask)) {
        newDoc[id] = newDoc[f.mask]
        delete newDoc[f.mask]
      }
    })
    // delete all keys that aren't in attributes
    const keys = _.keys(this.attributes)
    if (keys.length > 0) newDoc = _.pick(newDoc, keys)
    if (!skipped) newDoc = sanitization.sanitize(newDoc, this.attributes)
    return newDoc
  }

  validateDoc (doc, ignored = []) {
    let result = validation.validate(doc, this.attributes, ignored)
    if (!_.isEmpty(result)) {
      let err = new Error('Validation error')
      err.details = result
      return err
    }
    return null
  }
}

module.exports = DabCollection
