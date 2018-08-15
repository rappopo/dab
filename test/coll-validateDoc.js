'use strict'

const chai = require('chai')
const _ = require('lodash')
const expect = chai.expect

const Cls = require('../collection')

describe('Collection - validateDoc', function () {
  it('should ignore keys that aren\'t supported', function () {
    const cls = new Cls({
      name: 'test',
      attributes: {
        key1: { type: 'string', validator: { isIP: true } },
        key2: { type: 'string', validator: { isEmail: true } },
        key3: { type: 'string' },
        key4: { type: 'string', validator: { isTest: true, isTest1: true } }
      }
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
      attributes: {
        key1: { type: 'string', validator: { contains: '123' } },
        key2: { type: 'string', validator: { isEmail: true } },
        key3: { type: 'string', validator: { contains: '123', isEmail: true } },
        key4: { type: 'float' }
      }
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
      attributes: {
        key1: { type: 'float' },
        key2: { type: 'float', validator: { isFloat: { min: 50, max: 100 } } }
      }
    })

    let result = cls.validateDoc({
      key1: 123.456,
      key2: 55.5
    })
    expect(result).to.be.a('null')
  })

  it('should skip columns that explicitly tagged as ignored', function () {
    const cls = new Cls({
      name: 'test',
      attributes: {
        key1: { type: 'string', validator: { contains: '123' } },
        key2: { type: 'string', validator: { isEmail: true } },
        key3: { type: 'string', validator: { required: true, contains: '123', isEmail: true } },
        key4: { type: 'float' }
      }
    })

    let result = cls.validateDoc({
      key1: 'abcdefghij',
      key2: 'test@domain.com',
      key4: 123.456
    }, ['key1', 'key3'])
    expect(result).to.be.a('null')
  })
})
