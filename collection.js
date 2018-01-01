'use strict'

const _ = require('lodash')

const boolTrue = ['true', 'yes', '1'],
  boolFalse = ['false', 'no', '0']

class DabCollection {
  constructor (options) {
    options = options || {}
    this.name = null
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
    this.attribName = options.attribName || 'collection'
    const supported = ['string', 'integer', 'float', 'boolean', 'date', 'datetime', 'text']
    _.each(options.fields, f => {
      if (typeof f !== 'object') return
      if (_.isEmpty(f.id)) return
      if (supported.indexOf(f.type) === -1) return
      let field = {
        id: f.id,
        type: f.type,
        nullable: f.nullable ? true : false,
        required: f.required ? true : false,
        hidden: f.hidden ? true : false
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
          if (typeof f.default === 'number')
            field.default = Math.round(f.default)
          break
        case 'float':
          if (typeof f.default === 'number')
            field.default = f.default
          break
        case 'boolean':
          if (typeof f.default === 'boolean')
            field.default = f.default
          break
        case 'date': 
        case 'datetime': 
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
    if (!skipped) {
      _.each(this.fields, f => {
        if (!_.has(newDoc, f.id)) return
        let val
        switch(f.type) {
          case 'text':
          case 'string':
            newDoc[f.id] = '' + newDoc[f.id]
            break
          case 'integer':
            val = parseInt(newDoc[f.id])
            newDoc[f.id] = _.isNaN(val) ? null : val
            break
          case 'float':
            val = parseFloat(newDoc[f.id])
            newDoc[f.id] = _.isNaN(val) ? null : val
            break
          case 'boolean':
            if (typeof newDoc[f.id] !== 'boolean') {
              val = '' + newDoc[f.id]
              let bools = _.concat(boolTrue, boolFalse)
              if (bools.indexOf(newDoc[f.id]) === -1)
                newDoc[f.id] = null
              else
                newDoc[f.id] = boolTrue.indexOf(newDoc[f.id]) > -1
            }
            break
        }
      })
    }
    return newDoc
  }


}

module.exports = DabCollection