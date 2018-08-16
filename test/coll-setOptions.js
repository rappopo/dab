'use strict'

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const chaiSubset = require('chai-subset')
const _ = require('lodash')
const expect = chai.expect

chai.use(chaiSubset)
chai.use(chaiAsPromised)

const Cls = require('../collection')
let cls = null

describe('Collection - setOptions', function () {
  it('should return default if collection name isn\'t provided', function () {
    expect(function () {
      cls = new Cls()
    }).to.throw('Requires a name')
  })

  it('should only return attributes with supported types', function () {
    cls = new Cls({
      name: 'test',
      attributes: {
        key1: 'string',
        key2: 'text',
        key3: 'integer',
        key4: 'float',
        key5: 'boolean',
        key6: 'date',
        key7: 'datetime',
        key8: 'anytype1',
        key9: 'anytype2'
      }
    })
    let keys = _.keys(cls.attributes)
    expect(keys).to.eql(['key1', 'key2', 'key3', 'key4', 'key5', 'key6', 'key7', '_id'])
  })

  it('should return string length of 255 for strings that don\'t have length', function () {
    cls = new Cls({
      name: 'test',
      attributes: {
        key1: 'string',
        key2: { type: 'string', length: 10 }
      }
    })
    expect(cls.attributes.key1).to.include({ type: 'string', length: 255 })
    expect(cls.attributes.key2).to.include({ type: 'string', length: 10 })
  })

  it('should return the correct default values if provided', function () {
    cls = new Cls({
      name: 'test',
      attributes: {
        key1: { type: 'string', default: 'default' },
        key2: { type: 'string', default: 10 },
        key3: { type: 'integer', default: 10 },
        key4: { type: 'float', default: 10.123 },
        key5: { type: 'integer', default: 10.123 },
        key6: 'boolean',
        key7: { type: 'boolean', default: true },
        key8: { type: 'boolean', default: false }
      }
    })
    expect(cls.attributes.key1).to.include({ type: 'string', default: 'default' })
    expect(cls.attributes.key2).to.include({ type: 'string' }).and.not.have.property('default')
    expect(cls.attributes.key3).to.include({ type: 'integer', default: 10 })
    expect(cls.attributes.key4).to.include({ type: 'float', default: 10.123 })
    expect(cls.attributes.key5).to.include({ type: 'integer', default: 10 })
    expect(cls.attributes.key6).to.include({ type: 'boolean' }).and.not.have.property('default')
    expect(cls.attributes.key7).to.include({ type: 'boolean', default: true })
    expect(cls.attributes.key8).to.include({ type: 'boolean', default: false })
  })

  it('should return default order', function () {
    cls = new Cls({
      name: 'test',
      attributes: {
        key1: 'string',
        key2: 'string',
        key3: 'string'
      }
    })
    expect(cls.order).to.eql(['key1', 'key2', 'key3', '_id'])
  })

  it('should return custom order with non existing attributes removed', function () {
    cls = new Cls({
      name: 'test',
      order: ['key4', 'key3', 'key2', 'key1'],
      attributes: {
        key1: 'string',
        key2: 'string',
        key3: 'string'
      }
    })
    expect(cls.order).to.eql(['key3', 'key2', 'key1'])
  })

  it('should add id column if not provided', function () {
    cls = new Cls({
      name: 'test',
      attributes: {
        key1: 'string',
        key2: 'string',
        key3: 'string'
      }
    })
    expect(cls.order).to.eql(['key1', 'key2', 'key3', '_id'])
  })

  it('should throw error if multiple primaryKeys are defined', function () {
    let fn = function () {
      cls = new Cls({
        name: 'test',
        attributes: {
          key1: {
            type: 'string',
            primaryKey: true
          },
          key2: 'string',
          key3: 'string'
        }
      })
    }
    expect(fn).to.throw('Already has primary key')
  })

  it('should parse indexes correctly from array', function () {
    cls = new Cls({
      name: 'test',
      attributes: {
        key1: 'string',
        key2: 'string',
        key3: 'string'
      },
      indexes: ['key1', 'key2']
    })
    expect(cls.indexes).to.eql({
      key1: { column: ['key1'], unique: false },
      key2: { column: ['key2'], unique: false }
    })
  })

  it('should ignore index\'s columns that don\'t exist', function () {
    cls = new Cls({
      name: 'test',
      attributes: {
        key1: 'string',
        key2: 'string',
        key3: 'string'
      },
      indexes: ['key1', 'key2', 'key4']
    })
    expect(cls.indexes).to.eql({
      key1: { column: ['key1'], unique: false },
      key2: { column: ['key2'], unique: false }
    })
  })

  it('should parse indexes correctly from object', function () {
    cls = new Cls({
      name: 'test',
      attributes: {
        key1: 'string',
        key2: 'string',
        key3: 'string'
      },
      indexes: {
        index1: {
          column: 'key1',
          unique: true
        },
        index2: {
          column: ['key1', 'key2', 'key6']
        }
      }
    })
    expect(cls.indexes).to.eql({
      index1: { column: ['key1'], unique: true },
      index2: { column: ['key1', 'key2'], unique: false }
    })
  })
})
