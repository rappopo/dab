'use strict'

const chai = require('chai'),
  chaiAsPromised = require('chai-as-promised'),
  chaiSubset = require('chai-subset'),
  _ = require('lodash'),
  expect = chai.expect

chai.use(chaiSubset)
chai.use(chaiAsPromised)

const Cls = require('../collection'),
  body = [{
    _id: 'james-bond',
    name: 'James Bond',
    age: 35,
    code: '007'
  }, {
    _id: 'james-bauer',
    name: 'Jack Bauer',
    age: 32,
    code: 'JB'    
  }]

describe('Collection - setOptions', function () {
  it('should return default if collection name isn\'t provided', function () {
    expect(function() {
      let cls = new Cls();
    }).to.throw('Requires a name')
  })

  it('should only return attributes with supported types', function () {
    const cls = new Cls({
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
    expect(keys).to.eql(['key1', 'key2', 'key3', 'key4', 'key5', 'key6', 'key7'])
  })

  it('should return string length of 255 for strings that don\'t have length', function () {
    const cls = new Cls({
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
    const cls = new Cls({
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
    const cls = new Cls({
      name: 'test',
      attributes: {
        key1: 'string',
        key2: 'string',
        key3: 'string'
      }
    })
    expect(cls.order).to.eql(['key1', 'key2', 'key3'])
  })

  it('should return custom order with non existing attributes removed', function () {
    const cls = new Cls({
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

})  


