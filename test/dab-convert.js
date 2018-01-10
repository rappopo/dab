'use strict'

const chai = require('chai'),
  chaiAsPromised = require('chai-as-promised'),
  chaiSubset = require('chai-subset'),
  expect = chai.expect,
  moment = require('moment'),
  _ = require('lodash')

chai.use(chaiSubset)
chai.use(chaiAsPromised)

const Cls = require('../dab'),
  Collection = require('../collection'),
  body = [{
    _id: 'james-bond',
    name: 'James Bond',
    age: 35,
    code: '007'
  }, {
    _id: 'jack-bauer',
    name: 'Jack Bauer',
    age: 32,
    code: 'JB'    
  }]

describe('Dab - convert', function () {
  it('should return an array of converted documents according its converter', function () {
    const cls = new Cls()

    let converter = function (data) {
      data.name = data.name.toUpperCase()
      return data
    }

    let result = cls.convert(body, { converter: converter })

    expect(result[0]).to.have.property('name', 'JAMES BOND')
    expect(result[1]).to.have.property('name', 'JACK BAUER')
  })

  it('should return as is if no matched collection found', function () {
    const cls = new Cls()
    let result = cls.convert(body)
    expect(result).to.eql(body)
  })

  it('should return values whose id is in the collection attributes', function (done) {
    const collection = new Collection({
      name: 'test',
      attributes: {
        _id: 'string',
        name: 'text',
        age: 'integer',
      }
    })

    const cls = new Cls()
    cls.createCollection(collection).asCallback(function(err, status) {

      let result = cls.convert(body, { collection: 'test' })

      expect(result[0]).to.have.property('_id', 'james-bond')
      expect(result[0]).to.have.property('name', 'James Bond')
      expect(result[0]).to.have.property('age', 35)
      expect(result[0]).to.not.have.property('code')

      expect(result[1]).to.have.property('_id', 'jack-bauer')
      expect(result[1]).to.have.property('name', 'Jack Bauer')
      expect(result[1]).to.have.property('age', 32)
      expect(result[1]).to.not.have.property('code')

      done()      
    })
  })

  it('should convert body according to its attribute if it provided', function(done) {
    const cls = new Cls()
    cls.createCollection({
      name: 'test',
      attributes: {
        key1: 'datetime',
        key2: 'date',
        key3: 'string',
        key4: 'integer',
        key5: 'float',
        key6: 'boolean',
        key7: 'array',
        key8: 'object'
      }
    }).then(function(coll) {
      const dt = moment(new Date()).toISOString()
      let result = cls.convert({
        key1: dt,
        key2: dt,
        key3: 12345,
        key4: '12345',
        key5: '456.78',
        key6: 'true',
        key7: '["a", "b"]',
        key8: { "a": "test", "b": 1 }
      }, { collection: 'test' })
      expect(result.key1).to.equal(moment(dt).toISOString())
      expect(result.key2).to.equal(moment(dt).toISOString().substr(0, 10))
      expect(result.key3).to.equal('12345')
      expect(result.key4).to.equal(12345)
      expect(result.key5).to.equal(456.78)
      expect(result.key6).to.equal(true)
      expect(result.key7).to.eql(['a', 'b'])
      expect(result.key8).to.eql({ a: 'test', b: 1 })
      done()      
    })
  })



})