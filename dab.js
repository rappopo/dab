'use strict'

const _ = require('lodash')
const fs = require('fs')
const uuid = require('uuid/v4')
const nanoid = require('nanoid')
const DabCollection = require('./collection')

require('promise.ascallback').patch()

class Dab {
  constructor (options) {
    options = options || {}
    this.collection = {}
    this.client = null
    this._ = _
    this.uuid = uuid
    this.nanoid = nanoid
    this.options = {}
    this.setOptions(options)
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

  convert (data, params) {
    params = params || {}
    let isArray = _.isArray(data)
    let result = isArray ? _.cloneDeep(data) : [_.cloneDeep(data)]
    _.each(result, (r, i) => {
      let doc = this._defConverter(r)
      if (typeof params.converter === 'function') doc = params.converter(doc)
      if (this.collection[params.collection] && !_.isEmpty(this.collection[params.collection].attributes)) {
        doc = this.collection[params.collection].convertDoc(doc, params.skipSanitize)
      }
      result[i] = doc
    })
    return isArray ? result : result[0]
  }

  sanitize (params, body) {
    params = params || {}
    if (typeof params === 'string') params = { collection: params }
    // normalize sort
    if (params.sort) {
      let sort = {}
      if (_.isPlainObject(params.sort)) {
        _.forOwn(params.sort, (v, k) => {
          v = v + ''
          sort[k] = v.toLowerCase() === 'desc' || v === '-1' ? -1 : 1
        })
      } else if (typeof params.sort === 'string') {
        let arr = params.sort.split(',')
        _.each(arr, a => {
          a = _.trim(a).split(' ')
          sort[a[0]] = a.length === 1 ? 1 : (a[1].toLowerCase() === 'desc' || a[1] === '-1' ? -1 : 1)
        })
      } else if (_.isArray(params.sort)) {
        _.each(params.sort, s => {
          if (typeof s === 'string') {
            sort[s] = 1
          } else if (_.isPlainObject(s)) {
            _.forOwn(s, (v, k) => {
              v = v + ''
              sort[k] = v.toLowerCase() === 'desc' || v === '-1' ? -1 : 1
            })
          }
        })
      }
      if (_.isEmpty(sort)) delete params.sort
      else params.sort = sort
    }

    if (_.isEmpty(body)) return [params, body]

    let isArray = _.isArray(body)
    let result = isArray ? _.cloneDeep(body) : [_.cloneDeep(body)]
    _.each(result, (r, i) => {
      if (this.collection[params.collection] && !_.isEmpty(this.collection[params.collection].attributes)) {
        result[i] = this.collection[params.collection].sanitizeDoc(r, params.skipBody)
      }
    })

    let newBody = isArray ? result : result[0]

    return [params, newBody]
  }

  validateDoc (body, params) {
    body = body || {}
    params = params || {}
    if (params.collection && this.collection[params.collection] && !_.isEmpty(this.collection[params.collection].attributes)) {
      return this.collection[params.collection].validateDoc(body, params.ignoreColumn || [])
    }
    return null
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

  bulkCreate (body, params) {
    return this._notImplemented()
  }

  bulkUpdate (body, params) {
    return this._notImplemented()
  }

  bulkRemove (body, params) {
    return this._notImplemented()
  }

  /**
  * Util
  */

  _copy (src, dest, params) {
    params = params || {}
    params.limit = params.limit || this.options.limit
    params.query = params.query || {}
    let endResults = []

    function loop (pageNumber, callback) {
      src.find({
        collection: params.srcCollection || params.collection,
        query: params.query,
        limit: params.limit,
        page: pageNumber
      }).asCallback((err, result) => {
        if (err) return callback(err)
        if (result.data.length === 0) return callback()
        dest.bulkCreate(result.data, {
          collection: params.destCollection || params.collection,
          withDetail: params.withDetail
        }).asCallback((err, result) => {
          if (err) return callback(err)
          endResults.push(result)
          loop(pageNumber + 1, callback)
        })
      })
    }

    return new Promise((resolve, reject) => {
      loop(1, (err, result) => {
        if (err) return reject(err)
        let data = {
          success: true,
          stat: {
            ok: 0,
            fail: 0,
            total: 0
          }
        }
        if (params.withDetail) data.detail = []

        _.each(endResults, s => {
          data.stat.ok = data.stat.ok + s.stat.ok
          data.stat.fail = data.stat.fail + s.stat.fail
          data.stat.total = data.stat.total + s.stat.total
          if (params.withDetail) data.detail = data.detail.concat(s.detail)
        })
        resolve(data)
      })
    })
  }

  copyFrom (src, params) {
    params = params || {}

    if (typeof src !== 'string') return this._copy(src, this, params)
    return new Promise((resolve, reject) => {
      try {
        const body = JSON.parse(fs.readFileSync(src, 'utf8'))
        this.bulkCreate(body, params)
          .then(resolve)
          .catch(reject)
      } catch (err) {
        reject(err)
      }
    })
  }

  copyTo (dest, params) {
    params = params || {}

    if (typeof dest !== 'string') return this._copy(this, dest, params)

    let total = 0
    let me = this

    function loop (pageNumber, callback) {
      me.find({
        collection: params.collection,
        query: params.query,
        limit: params.limit,
        page: pageNumber
      }).asCallback((err, result) => {
        if (err) return callback(err)
        if (result.data.length === 0) return callback()
        let data = []
        let prefix = total === 0 ? '' : ',\n'
        me._.each(result.data, d => {
          data.push(JSON.stringify(d))
        })
        fs.appendFileSync(dest, prefix + data.join(','))
        total += result.data.length
        loop(pageNumber + 1, callback)
      })
    }

    return new Promise((resolve, reject) => {
      try {
        fs.writeFileSync(dest, '[')
        loop(1, (err, result) => {
          if (err) return reject(err)
          fs.appendFileSync(dest, ']\n')
          let data = {
            success: true,
            stat: {
              ok: total,
              fail: 0,
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

  addCollection (name, params) {
    return this.createCollection(name, params)
  }

  deleteCollection (name, params) {
    return this.removeCollection(name, params)
  }

  destroyCollection (name, params) {
    return this.removeCollection(name, params)
  }

  /**
  * Collection
  */

  createCollection (coll, params) {
    params = params || {}
    if (typeof coll === 'object') coll = new DabCollection(coll)
    if (coll.constructor.name !== 'DabCollection') return Promise.reject(new Error('Collection must be a DabCollection instance'))
    if (this._.has(this.collection, coll.name)) return Promise.reject(new Error('Collection already exists'))
    this.collection[coll.name] = coll
    return Promise.resolve(true)
  }

  renameCollection (oldName, newName, params) {
    params = params || {}
    if (this._.isEmpty(oldName) || this._.isEmpty(newName)) return Promise.reject(new Error('Require old & new collection names'))
    if (!this._.has(this.collection, oldName)) return Promise.reject(new Error('Collection not found'))
    if (this._.has(this.collection, newName)) return Promise.reject(new Error('New collection already exists'))
    this.collection[newName] = this._.cloneDeep(this.collection[oldName])
    this.collection[newName].name = newName
    delete this.collection[oldName]
    return Promise.resolve(true)
  }

  removeCollection (name, params) {
    params = params || {}
    if (this._.isEmpty(name)) return Promise.reject(new Error('Requires collection name'))
    if (!this._.has(this.collection, name)) return Promise.reject(new Error('Collection not found'))
    delete this.collection[name]
    return Promise.resolve(true)
  }
}

module.exports = Dab
