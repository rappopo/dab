'use strict'

const chai = require('chai'),
  chaiSubset = require('chai-subset'),
  _ = require('lodash'),
  util = require('util'),
  expect = chai.expect

const Cls = require('../collection')

describe('Collection - validateDoc', function () {
  it('should ignore keys that aren\'t supported', function () {
    const cls = new Cls({
      name: 'test',
      fields: [
        { id: 'key1', type: 'string', validator: { isIP: true }},
        { id: 'key2', type: 'string', validator: { isEmail: true }},
        { id: 'key3', type: 'string' },
        { id: 'key4', type: 'string', validator: { isTest: true, isTest1: true }}
      ]
    })

    let result = cls.validateDoc({
      key1: 'abcdefghij',
      key2: 'abcdefghij',
      key3: 'abcdefghij',
      key4: 'abcdefghij'
    })

    let keys = _.keys(result.details)

    expect(result).to.be.a('error').and.have.property('message', 'Validation error')
    expect(keys).to.eql(['key1', 'key2'])
    
  })

  it('should validate common pattern', function () {
    const cls = new Cls({
      name: 'test',
      fields: [
        { id: 'key1', type: 'string', validator: { contains: '123' }},
        { id: 'key2', type: 'string', validator: { isEmail: true }},
        { id: 'key3', type: 'string', validator: { contains: '123', isEmail: true }},
        { id: 'key4', type: 'float' }
      ]
    })

    let result = cls.validateDoc({
      key1: 'abcdefghij123xxx',
      key2: 'test@domain.com',
      key3: 'test123test@domain.com',
      key4: 123.456
    })

    expect(result).to.be.a('null')
    
  })

  it('should override default type if validation is provided', function () {
    const cls = new Cls({
      name: 'test',
      fields: [
        { id: 'key1', type: 'float' },
        { id: 'key2', type: 'float', validator: { isFloat: { min: 50, max: 100 } }}
      ]
    })

    let result = cls.validateDoc({
      key1: 123.456,
      key2: 55.5
    })
    expect(result).to.be.a('null')
    
  })

  /*


  it('should return as is if no fields provided', function () {
    const cls = new Cls({
      name: 'test',
      fields: [
        { id: 'ip', type: 'string', isIP: true },
        { id: 'email', type: 'string', isEmail: true },
        { id: 'none', type: 'string' },
        { id: 'ip_email', type: 'string', isIP: true, isEmail: true }
      ]
    })

    let result = cls.validateDoc({
      ip: '123456789',
      email: 'test@domain.com',
      none: null,
      ip_email: '123.123.123.123'
    })

    expect(result).to.be.a('error').and.have.property('message', 'Validation error')
    expect(result.details).to.have.property('ip').that.eql(['isIP'])
    
  })

  */
})
