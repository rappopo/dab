'use strict'

const _ = require('lodash'),
  fs = require('fs'),
  uuid = require('uuid/v4')

require('promise.ascallback').patch()

class Dab {
  constructor (options, schema) {
    options = options || {}
    this.schema = null
    this.client = null
    this._ = _
    this.uuid = uuid
    this.options = {}
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

  setSchema (schema) {
    if (schema) this.schema = schema
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
      let rec = this._defConverter(r)
      if (typeof params.converter === 'function')
        rec = params.converter(rec)
      if (this.schema) 
        rec = this.schema.convertDoc(rec, params)
      result[i] = rec
    })
    return isArray ? result : result[0]
  }

  sanitize (params, body) {
    params = params || {}
    body = body || {}
    let newBody = _.cloneDeep(body)
    if (typeof params === 'string') {
      _.each(['dbName', 'collection', 'index', 'table'], type => {
        if (_.has(this.options, type)) {
          let p = {}
          p[type] = params
          params = p
        } 
      })
      if (!_.isPlainObject(params)) params = {}
    }
    if (this.schema)
      newBody = this.schema.sanitizeDoc(newBody, params)
    return [params, newBody]
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
  
}

module.exports = Dab