'use strict'

const _ = require('lodash')

class Dab {
  constructor (options = {}) {
    this.client = null
    this._ = _
    this.options = {}
    this.setOptions(options)
  }

  /**
  * Common
  */

  setOptions (options = {}) {
    options.limit = options.limit || 25
    options.options = options.options || {}
    this.options = this._.merge(this.options, options)
  }

  setClient (options) {
  }

  getClient () {
    if (!this.client) this.setClient()
    return this.client    
  }

  /**
  * Helper
  */

  convertDoc (data, param = {}) {
    let isArray = _.isArray(data),
      result = isArray ? _.cloneDeep(data) : [_.cloneDeep(data)]
    _.each(result, (r, i) => {
      result[i] = this._defConverter(r)
      if (typeof param.converter === 'function')
        result[i] = param.converter(result[i])
    })
    return isArray ? result : result[0]
  }

  sanitize (params, body = {}) {
    body = _.cloneDeep(body)
    params = typeof params === 'string' ? { dbName: params } : (params || {})
    return [params, body]
  }

  delFakeGetReal (body) {
    if (body[this.options.idDest] && this.options.idDest !== this.options.idSrc) {
      body[this.options.idSrc] = body[this.options.idDest]
      delete body[this.options.idDest]
    }
    let id = body[this.options.idSrc]
    return [body, id]    
  }

  /**
  * Privates
  */

  _defConverter (doc = {}) {
    let newDoc = _.cloneDeep(doc),
      idSrc = this.options.idSrc || '_id',
      idDest = this.options.idDest || idSrc
    if (idSrc !== idDest && _.has(newDoc, idSrc)) {
      newDoc[idDest] = newDoc[idSrc]
      delete newDoc[idSrc]
    }
    return newDoc
  }

  _notImplemented () {
    return Promise.reject(new Error('Not implemented'))
  }

  /**
  * Main methods
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
  * Aliases
  */

  delete (id, params) {
    return this.remove(id, params)
  }

  destroy (id, params) {
    return this.remove(id, params)
  }
  
}

module.exports = Dab