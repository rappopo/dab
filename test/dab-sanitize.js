'use strict'

const chai = require('chai'),
  chaiAsPromised = require('chai-as-promised'),
  chaiSubset = require('chai-subset'),
  moment = require('moment'),
  expect = chai.expect

chai.use(chaiSubset)
chai.use(chaiAsPromised)

const Cls = require('../dab')

describe('Dab - sanitize', function () {
  it('should return default params if params is a string', function () {
    const cls = new Cls()
    let [params, body] = cls.sanitize('test1')
    expect(params).to.have.property('collection', 'test1')
  })

  it('should sanitize body according to its attribute if it provided', function(done) {
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
    }).then(function(result) {
      const dt = moment(new Date()).toISOString()
      let [params, body] = cls.sanitize('test', {
        key1: dt,
        key2: dt,
        key3: 12345,
        key4: '12345',
        key5: '456.78',
        key6: 'true',
        key7: '["a", "b"]',
        key8: { "a": "test", "b": 1 }
      })
      expect(body.key1).to.equal(moment(dt).toISOString())
      expect(body.key2).to.equal(moment(dt).toISOString().substr(0, 10))
      expect(body.key3).to.equal('12345')
      expect(body.key4).to.equal(12345)
      expect(body.key5).to.equal(456.78)
      expect(body.key6).to.equal(true)
      expect(body.key7).to.eql(['a', 'b'])
      expect(body.key8).to.eql({ a: 'test', b: 1 })
      done()      
    })

  })
})