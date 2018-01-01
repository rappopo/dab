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

  it('should only return fields with supported types', function () {
    const cls = new Cls({
      name: 'test',
      fields: [
        { id: 'key1', type: 'string' },
        { id: 'key2', type: 'text' },
        { id: 'key3', type: 'integer' },
        { id: 'key4', type: 'float' },
        { id: 'key5', type: 'boolean' },
        { id: 'key6', type: 'date' },
        { id: 'key7', type: 'datetime' },
        { id: 'key8', type: 'anytype1' },
        { id: 'key9', type: 'anytype2' }
      ]
    })
    let keys = _.map(cls.fields, 'id')
    expect(keys).to.eql(['key1', 'key2', 'key3', 'key4', 'key5', 'key6', 'key7'])
  })

  it('should return string length of 255 for strings that don\'t have length', function () {
    const cls = new Cls({
      name: 'test',
      fields: [
        { id: 'key1', type: 'string' },
        { id: 'key2', type: 'string', length: 10 },
      ]
    })
    expect(cls.fields[0]).to.include({ id: 'key1', type: 'string', length: 255 })
    expect(cls.fields[1]).to.include({ id: 'key2', type: 'string', length: 10 })
  })

  it('should return the correct default values if provided', function () {
    const cls = new Cls({
      name: 'test',
      fields: [
        { id: 'key1', type: 'string', default: 'default' },
        { id: 'key2', type: 'string', default: 10 },
        { id: 'key3', type: 'integer', default: 10 },
        { id: 'key4', type: 'float', default: 10.123 },
        { id: 'key5', type: 'integer', default: 10.123 },
        { id: 'key6', type: 'boolean' },
        { id: 'key7', type: 'boolean', default: true },
        { id: 'key8', type: 'boolean', default: false },
      ]
    })
    expect(cls.fields[0]).to.include({ id: 'key1', type: 'string', default: 'default' })
    expect(cls.fields[1]).to.include({ id: 'key2', type: 'string' }).and.not.have.property('default')
    expect(cls.fields[2]).to.include({ id: 'key3', type: 'integer', default: 10 })
    expect(cls.fields[3]).to.include({ id: 'key4', type: 'float', default: 10.123 })
    expect(cls.fields[4]).to.include({ id: 'key5', type: 'integer', default: 10 })
    expect(cls.fields[5]).to.include({ id: 'key6', type: 'boolean' }).and.not.have.property('default')
    expect(cls.fields[6]).to.include({ id: 'key7', type: 'boolean', default: true })
    expect(cls.fields[7]).to.include({ id: 'key8', type: 'boolean', default: false })
  })

  it('should return default order', function () {
    const cls = new Cls({
      name: 'test',
      fields: [
        { id: 'key1', type: 'string' },
        { id: 'key2', type: 'string' },
        { id: 'key3', type: 'string' }
      ]
    })
    expect(cls.order).to.eql(['key1', 'key2', 'key3'])
  })

  it('should return custom order with non existing fields removed', function () {
    const cls = new Cls({
      name: 'test',
      order: ['key4', 'key3', 'key2', 'key1'],
      fields: [
        { id: 'key1', type: 'string' },
        { id: 'key2', type: 'string' },
        { id: 'key3', type: 'string' }
      ]
    })
    expect(cls.order).to.eql(['key3', 'key2', 'key1'])
  })

})  


