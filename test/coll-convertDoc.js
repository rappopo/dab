'use strict'

const chai = require('chai'),
  chaiAsPromised = require('chai-as-promised'),
  chaiSubset = require('chai-subset'),
  _ = require('lodash'),
  expect = chai.expect

chai.use(chaiSubset)
chai.use(chaiAsPromised)

const Cls = require('../collection'),
  body = {
    _id: 'james-bond',
    name: 'James Bond',
    age: 35,
    code: '007'
  }

describe('Collection - convertDoc', function () {

  it('should return as is if no attributes provided', function () {
    const cls = new Cls({
      name: 'test'
    })

    let result = cls.convertDoc(body)

    expect(result).to.have.property('_id', 'james-bond')
    expect(result).to.have.property('name', 'James Bond')
    expect(result).to.have.property('age', 35)
    expect(result).to.have.property('code', '007')
  })


  it('should only return values whose id is in the attributes', function () {
    const cls = new Cls({
      name: 'test',
      attributes: {
        _id: 'string',
        name: 'string',
        age: 'integer'
      }
    })

    let result = cls.convertDoc(body)
    
    expect(result).to.have.property('_id', 'james-bond')
    expect(result).to.have.property('name', 'James Bond')
    expect(result).to.have.property('age', 35)
    expect(result).to.not.have.property('code')
  })

  it('should return values with custom order', function () {
    const cls = new Cls({
      name: 'test',
      order: ['age', '_id', 'name'],
      attributes: {
        _id: 'string',
        name: 'string',
        age: 'integer'
      }
    })

    let result = cls.convertDoc(body),
      keys = _.keys(result)

    expect(result).to.eql(_.omit(body, 'code'))
    expect(keys[0]).to.equal('age')
    expect(keys[1]).to.equal('_id')
    expect(keys[2]).to.equal('name')
  })

  it('should return values with custom mask', function () {
    const cls = new Cls({
      name: 'test',
      attributes: {
        _id: { type: 'string', mask: 'ident' },
        name: { type: 'text', mask: 'nama' },
        age: { type: 'integer', mask: 'usia' }
      }
    })
    
    let result = cls.convertDoc(body)
    expect(result).to.eql({ ident: 'james-bond', 'nama': 'James Bond', usia: 35 })
  })

  it('should only return values which aren\'t hidden', function () {
    const cls = new Cls({
      name: 'test',
      attributes: {
        _id: { type: 'string' },
        name: { type: 'text', hidden: true },
        age: { type: 'integer', hidden: true },
        code: { type: 'string' }
      }
    })
    
    let result = cls.convertDoc(body)

    expect(result).to.have.property('_id', 'james-bond')
    expect(result).to.not.have.property('name')
    expect(result).to.not.have.property('age')
    expect(result).to.have.property('code', '007')
  })

})
