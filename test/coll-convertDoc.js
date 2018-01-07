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

  it('should return as is if no fields provided', function () {
    const cls = new Cls({
      name: 'test'
    })

    let result = cls.convertDoc(body)
    
    expect(result).to.have.property('_id', 'james-bond')
    expect(result).to.have.property('name', 'James Bond')
    expect(result).to.have.property('age', 35)
    expect(result).to.have.property('code', '007')
  })


  it('should only return values whose id is in the fields', function () {
    const cls = new Cls({
      name: 'test',
      fields: [
        { id: '_id', type: 'string' },
        { id: 'name', type: 'text' },
        { id: 'age', type: 'integer' },
      ]
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
      fields: [
        { id: '_id', type: 'string' },
        { id: 'name', type: 'text' },
        { id: 'age', type: 'integer' },
      ]
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
      fields: [
        { id: '_id', type: 'string', mask: 'ident' },
        { id: 'name', type: 'text', mask: 'nama' },
        { id: 'age', type: 'integer', mask: 'usia' },
      ]
    })
    
    let result = cls.convertDoc(body)
    expect(result).to.eql({ ident: 'james-bond', 'nama': 'James Bond', usia: 35 })
  })

  it('should only return values which aren\'t hidden', function () {
    const cls = new Cls({
      name: 'test',
      fields: [
        { id: '_id', type: 'string' },
        { id: 'name', type: 'text', hidden: true },
        { id: 'age', type: 'integer', hidden: true },
        { id: 'code', type: 'string' },
      ]
    })
    
    let result = cls.convertDoc(body)

    expect(result).to.have.property('_id', 'james-bond')
    expect(result).to.not.have.property('name')
    expect(result).to.not.have.property('age')
    expect(result).to.have.property('code', '007')
  })

})
