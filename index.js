'use strict'

const _ = require('lodash'),
  fs = require('fs'),
  uuid = require('uuid/v4')

require('promise.ascallback').patch()

class Dab {
  constructor (options, schema) {
    options = options || {}
    schema = schema || {}
    this.client = null
    this._ = _
    this.uuid = uuid,
    this.options = {}
    this.schema = {}
    this.setOptions(options)
    this.setSchema(schema)
  }

  /**
  * Common
  */

  setOptions (options) {
    options = options || {}
    options.limit = options.limit || 25
    options.options = options.options || {}
    this.options = this._.merge(this.options, options)
    return this
  }

  setClient (options) {
    return this
  }

  getClient () {
    if (!this.client) this.setClient()
    return this.client    
  }

  /**
  * Helper
  */

  convertDoc (data, params) {
    params = params || {}
    let isArray = _.isArray(data),
      result = isArray ? _.cloneDeep(data) : [_.cloneDeep(data)]
    _.each(result, (r, i) => {
      result[i] = this._defConverter(r)
      if (typeof params.converter === 'function')
        result[i] = params.converter(result[i])
    })
    return isArray ? result : result[0]
  }

  dump (data) {
    if (_.isEmpty(this.schema) || _.isEmpty(this.schema.fields)) return data
    let isArray = _.isArray(data),
      result = []
    _.each(isArray ? data : [data], (d, i) => {
      let rec = {}
      _.each(this.schema.order, o => {
        let field = _.find(this.schema.fields, { key: o })
        if (field && !field.hidden) 
          rec[this.schema.mask[o] || o] = d[o] || null
      })
      result.push(rec)
    })
    return isArray ? result : result[0]
  }

  sanitize (params, body) {
    params = params || {}
    body = body || {}
    let newBody = _.cloneDeep(body)
//    params = typeof params === 'string' ? { dbName: params } : (params || {})
    if (this.schema && !_.isEmpty(this.schema.mask)) {
      let keys = _.keys(this.schema.fields)
      _.each(keys, k => {
        if (this.schema.mask[k] && _.has(newBody, this.schema.mask[k])) {
          newBody[k] = newBody[this.schema.mask[k]]
          delete newBody[this.schema.mask[k]]
        }
      })
    }
    return [params, body]
  }

  /**
  * Private
  */

  _defConverter (doc) {
    doc = doc || {}
    return doc
  }

  _notImplemented () {
    return Promise.reject(new Error('Not implemented'))
  }

  /**
  * Main method
  */

  find (params) {
    return this._notImplemented()
  }

  findOne (id, params) {
    return this._notImplemented()
  }

  create (body, params) {
    return this._notImplemented()
  }

  update (id, body, params) {
    return this._notImplemented()
  }

  remove (id, params) {
    return this._notImplemented()
  }

  /**
  * Bulk
  */

  bulkCreate(body, params) {
    return this._notImplemented()    
  }

  bulkUpdate(body, params) {
    return this._notImplemented()    
  }

  bulkRemove(body, params) {
    return this._notImplemented()    
  }

  /**
  * Util
  */

  _copy(src, dest, params) {
    params = params || {}
    params.limit = params.limit || this.options.limit
    params.query = params.query || {}
    let me = this, endResults = []

    function loop(pageNumber, callback) {
      src.find({
        query: params.query,
        limit: params.limit,
        page: pageNumber
      }).asCallback((err, result) => {
        if (err)
          return callback(err)
        if (result.data.length === 0)
          return callback()
        dest.bulkCreate(result.data, { withDetail: params.withDetail }).asCallback((err, result) => {
          if (err)
            return callback(err)
          endResults.push(result)
          loop(pageNumber + 1, callback)
        }) 
      })
    }

    return new Promise((resolve, reject) => {
      loop(1, (err, result) => {
        if (err)
          return reject(err)
        let data = {
          success: true,
          stat: {
            ok: 0,
            fail: 0,
            total: 0
          }
        }
        if (params.withDetail)
          data.detail = []

        _.each(endResults, s => {
          data.stat.ok = data.stat.ok + s.stat.ok
          data.stat.fail = data.stat.fail + s.stat.fail
          data.stat.total = data.stat.total + s.stat.total
          if (params.withDetail)
            data.detail = data.detail.concat(s.detail)
        })
        resolve(data)
      })
    })
  }

  copyFrom(src, params) {
    params = params || {}
    if (typeof src !== 'string')
      return this._copy(src, this, params)
    return new Promise((resolve, reject) => {
      try {
        const body = JSON.parse(fs.readFileSync(src, 'utf8'))
        this.bulkCreate(body, params)
        .then(resolve)
        .catch(reject)
      } catch(err) {
        reject(err)
      }
    })
  }

  copyTo(dest, params) {
    params = params || {}
    if (typeof dest !== 'string')
      return this._copy(this, dest, params)

    let total = 0, me = this

    function loop(pageNumber, callback) {
      me.find({
        query: params.query,
        limit: params.limit,
        page: pageNumber
      }).asCallback((err, result) => {
        if (err)
          return callback(err)
        if (result.data.length === 0)
          return callback()
        me._.each(result.data, d => {
          let prefix = total === 0 ? '' : ',\n'
          fs.appendFileSync(dest, prefix + JSON.stringify(d))
        })
        total += result.data.length
        loop(pageNumber + 1, callback)
      })
    }

    return new Promise((resolve, reject) => {
      try {
        fs.writeFileSync(dest, '[')
        loop(1, (err, result) => {
          fs.appendFileSync(dest, ']\n')
          let data = {
            success: true,
            stat: {
              total: total
            }
          }
          resolve(data)
        })
      } catch (err) {
        reject(err)
      }
    })
  }

  /**
  * Alias
  */

  add (body, params) {
    return this.create(body, params)
  }

  bulkAdd (body, params) {
    return this.bulkCreate(body, params)
  }

  insert (body, params) {
    return this.create(body, params)
  }

  bulkInsert (body, params) {
    return this.bulkCreate(body, params)
  }

  edit (id, body, params) {
    return this.update(id, body, params)
  }

  bulkEdit (body, params) {
    return this.bulkUpdate(body, params)
  }

  delete (id, params) {
    return this.remove(id, params)
  }

  bulkDelete (body, params) {
    return this.bulkRemove(body, params)
  }

  destroy (id, params) {
    return this.remove(id, params)
  }

  bulkDestroy (body, params) {
    return this.bulkRemove(body, params)
  }
  
  /**
  * Schema
  */

  getSchema () {
    return this.schema
  }

  setSchema (source) {
    source = source || {}
    if (_.isEmpty(source)) {
      this.schema = {}
      return this
    }
    const supported = ['string', 'integer', 'float', 'boolean', 'date', 'datetime', 'text']
    let schema = {
      fields: []
    }
    if (_.isArray(source)) {
      source = {
        fields: source
      }
    }
    _.each(source.fields, f => {
      if (typeof f !== 'object') return
      if (_.isEmpty(f.key)) return
      if (f.subtype !== 'custom' && supported.indexOf(f.type) === -1) return
      if (f.subtype === 'custom')
        delete f.subtype
      let field = {
        key: f.key,
        type: f.type,
        nullable: f.nullable ? true : false,
        required: f.required ? true : false,
        hidden: f.hidden ? true : false
      }
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
      schema.fields.push(field)
    })
    const keys = _.map(schema.fields, 'key')
    schema.order = source.order || keys
    _.each(schema.order, (k, i) => {
      if (keys.indexOf(k) === -1)
        _.pullAt(schema.order, i)
    })
    schema.mask = source.mask || {}
    _.forOwn(schema.mask, (v, k) => {
      if (keys.indexOf(k) === -1)
        delete schema.mask[k]
    })
    this.schema = schema
    return this
  }

}

module.exports = Dab