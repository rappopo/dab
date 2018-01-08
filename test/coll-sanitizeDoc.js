'use strict'

const chai = require('chai'),
  chaiAsPromised = require('chai-as-promised'),
  chaiSubset = require('chai-subset'),
  _ = require('lodash'),
  expect = chai.expect

chai.use(chaiSubset)
chai.use(chaiAsPromised)

const Cls = require('../collection')

describe('Collection - sanitizeDoc', function () {

  it('should return as is if no attributes provided', function () {
    const cls = new Cls({
      name: 'test'
    })

    let result = cls.sanitizeDoc({
      _id: 'james-bond',
      name: 'James Bond',
      age: 35,
      code: '007'
    })
    
    expect(result).to.have.property('_id', 'james-bond')
    expect(result).to.have.property('name', 'James Bond')
    expect(result).to.have.property('age', 35)
    expect(result).to.have.property('code', '007')
  })

  it('should return the sanitized result if attributes are applied', function () {
    const cls = new Cls({
      name: 'test',
      attributes: {
        kstring: 'string',
        kint: 'integer',
        kfloat: 'float',
        kboolean: 'boolean',
        kany: 'string',
      }
    })
    let result = cls.sanitizeDoc({
      kstring: 123456,
      kint: 123456,
      kfloat: 123.456,
      kboolean: 'false',
      kany: 'John Doe'     
    })

    expect(result).to.have.property('kstring', '123456')
    expect(result).to.have.property('kint', 123456)
    expect(result).to.have.property('kfloat', 123.456)
    expect(result).to.have.property('kboolean', false)
    expect(result).to.have.property('kany', 'John Doe')
  })

  it('should return as is if it skipped', function () {
    const cls = new Cls({
      name: 'test',
      attributes: {
        kstring: 'string',
        kint: 'integer',
        kfloat: 'float',
        kboolean: 'boolean',
        kany: 'string',
      }
    })
    let result = cls.sanitizeDoc({
      kstring: 123456,
      kint: 123456,
      kfloat: 123.456,
      kboolean: 'false',
      kany: 'John Doe'     
    }, true)

    expect(result).to.have.property('kstring', 123456)
    expect(result).to.have.property('kint', 123456)
    expect(result).to.have.property('kfloat', 123.456)
    expect(result).to.have.property('kboolean', 'false')
    expect(result).to.have.property('kany', 'John Doe')
  })

  it('should return current result if mask is empty', function () {
    const cls = new Cls({
      name: 'test',
      attributes: {
        kstring: 'string',
        kint: 'integer',
        kfloat: 'float',
        kboolean: 'boolean',
        kany: 'string',
      }
    })
    let result = cls.sanitizeDoc({
      kstring: 'test',
      kint: 123456,
      kfloat: 123.456,
      kboolean: false,
      kany: 'John Doe'
    })
    expect(result).to.have.property('kstring', 'test')
    expect(result).to.have.property('kint', 123456)
    expect(result).to.have.property('kfloat', 123.456)
    expect(result).to.have.property('kboolean', false)
    expect(result).to.have.property('kany', 'John Doe')
  })

  it('should return the correct result if mask are applied', function () {
    const cls = new Cls({
      name: 'test',
      attributes: {
        kstring: { type: 'string', mask: '_id' },
        kint: { type: 'integer', mask: 'age' },
        kfloat: { type: 'float', mask: 'weight' },
        kboolean: { type: 'boolean', mask: 'female' },
        kany: { type: 'string', mask: 'name' }
      }
    })
    let result = cls.sanitizeDoc({
      _id: 'test',
      age: 123456,
      weight: 123.456,
      female: false,
      name: 'John Doe'
    })
    expect(result).to.have.property('kstring', 'test')
    expect(result).to.have.property('kint', 123456)
    expect(result).to.have.property('kfloat', 123.456)
    expect(result).to.have.property('kboolean', false)
    expect(result).to.have.property('kany', 'John Doe')
  })


})
