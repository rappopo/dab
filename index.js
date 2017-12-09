'use strict'

const _ = require('lodash'),
  fs = require('fs'),
  uuid = require('uuid/v4')

require('promise.ascallback').patch()

class Dab {
  constructor (options = {}) {
    this.client = null
    this._ = _
    this.uuid = uuid,
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
  * Private
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

  _copy(src, dest, params = {}) {
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

  copyFrom(src, params = {}) {
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

  copyTo(dest, params = {}) {
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