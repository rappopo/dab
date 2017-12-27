'use strict'

const chai = require('chai'),
  chaiAsPromised = require('chai-as-promised'),
  chaiSubset = require('chai-subset'),
  expect = chai.expect

chai.use(chaiSubset)
chai.use(chaiAsPromised)

const Cls = require('../index'),
  input = {
    kstring: 'test',
    kint: 123456,
    kfloat: 123.456,
    kboolean: false,
    kany: 'John Doe'
  },
  schema = {
    fields: [
      { key: '_id', type: 'string' },
      { key: 'age', type: 'integer' },
      { key: 'weight', type: 'float' },
      { key: 'female', type: 'boolean' },
      { key: 'name', type: 'string' },
    ]
  },
  maskedSchema = {
    fields: [
      { key: '_id', type: 'string', mask: 'kstring' },
      { key: 'age', type: 'integer', mask: 'kint' },
      { key: 'weight', type: 'float', mask: 'kfloat' },
      { key: 'female', type: 'boolean', mask: 'kboolean' },
      { key: 'name', type: 'string', mask: 'kany' },
    ]
  }

describe('sanitize', function () {
  it('should return default params if params is a string', function () {
    const cls1 = new Cls({ dbName: 'test' }),
      cls2 = new Cls({ collection: 'test' }),
      cls3 = new Cls({ index: 'test' }),
      cls4 = new Cls({ table: 'test' }),
      cls5 = new Cls()
    let [params1, body1] = cls1.sanitize('test1')
    expect(params1).to.have.property('dbName', 'test1')
    let [params2, body2] = cls2.sanitize('test1')
    expect(params2).to.have.property('collection', 'test1')
    let [params3, body3] = cls3.sanitize('test1')
    expect(params3).to.have.property('index', 'test1')
    let [params4, body4] = cls4.sanitize('test1')
    expect(params4).to.have.property('table', 'test1')
    let [params5, body5] = cls5.sanitize('test1')
    expect(params5).to.be.a('object').that.is.empty
  })

  it('should return the sanitized body if schema fields are applied', function () {
    const cls = new Cls(null, {
      fields: [
        { key: 'kstring', type: 'string' },
        { key: 'kint', type: 'integer' },
        { key: 'kfloat', type: 'float' },
        { key: 'kboolean', type: 'boolean' },
        { key: 'kany', type: 'string' },
      ]
    })
    let [params, body] = cls.sanitize(null, {
      kstring: 123456,
      kint: 123456,
      kfloat: 123.456,
      kboolean: 'false',
      kany: 'John Doe'     
    })

    expect(body).to.have.property('kstring', '123456')
    expect(body).to.have.property('kint', 123456)
    expect(body).to.have.property('kfloat', 123.456)
    expect(body).to.have.property('kboolean', false)
    expect(body).to.have.property('kany', 'John Doe')
  })

  it('should return current body if mask is empty', function () {
    const cls = new Cls(null, schema)
    let [params, body] = cls.sanitize(null, input)
    expect(body).to.have.property('kstring', 'test')
    expect(body).to.have.property('kint', 123456)
    expect(body).to.have.property('kfloat', 123.456)
    expect(body).to.have.property('kboolean', false)
    expect(body).to.have.property('kany', 'John Doe')
  })

  it('should return the correct body if mask are applied', function () {
    const cls = new Cls(null, maskedSchema)
    let [params, body] = cls.sanitize(null, input)
    expect(body).to.have.property('_id', 'test')
    expect(body).to.have.property('age', 123456)
    expect(body).to.have.property('weight', 123.456)
    expect(body).to.have.property('female', false)
    expect(body).to.have.property('name', 'John Doe')
  })

})