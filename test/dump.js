'use strict'

const chai = require('chai'),
  chaiAsPromised = require('chai-as-promised'),
  chaiSubset = require('chai-subset'),
  expect = chai.expect,
  _ = require('lodash')

chai.use(chaiSubset)
chai.use(chaiAsPromised)

const Cls = require('../index'),
  body = {
    id: 'james-bond',
    name: 'James Bond',
    age: 35,
    code: '007'
  }

describe('dump', function () {
  it('should return as is if doesn\'t have schema', function () {
    const cls = new Cls()
    let result = cls.dump(body)
    expect(result).to.eql(body)
  })

  it('should return values with stripped fields if field doesn\'t exists', function () {
    const cls = new Cls(null, {
      fields: [
        { key: 'id', type: 'string' },
        { key: 'name', type: 'text' },
        { key: 'age', type: 'integer' },
      ]
    })

    let result = cls.dump(body)
    
    expect(result).to.have.property('id', 'james-bond')
    expect(result).to.have.property('name', 'James Bond')
    expect(result).to.have.property('age', 35)
    expect(result).to.not.have.property('code')
  })

  it('should return values with custom order', function () {
    const cls = new Cls(null, {
      order: ['age', 'id', 'name'],
      fields: [
        { key: 'id', type: 'string' },
        { key: 'name', type: 'text' },
        { key: 'age', type: 'integer' },
      ]
    })

    let result = cls.dump(body),
      keys = _.keys(result)

    expect(result).to.eql(_.omit(body, 'code'))
    expect(keys[0]).to.equal('age')
    expect(keys[1]).to.equal('id')
    expect(keys[2]).to.equal('name')
  })

  it('should return values with custom mask', function () {
    const cls = new Cls(null, {
      mask: { id: '_id', name: 'nama', age: 'usia', code: 'kode' },
      fields: [
        { key: 'id', type: 'string' },
        { key: 'name', type: 'text' },
        { key: 'age', type: 'integer' },
      ]
    })
    
    let result = cls.dump(body)

    expect(result).to.eql({ _id: 'james-bond', 'nama': 'James Bond', usia: 35 })
  })

  it('should return values with stripped fields if field is hidden', function () {
    const cls = new Cls(null, {
      fields: [
        { key: 'id', type: 'string' },
        { key: 'name', type: 'text', hidden: true },
        { key: 'age', type: 'integer', hidden: true },
        { key: 'code', type: 'string' },
      ]
    })
    
    let result = cls.dump(body)

    expect(result).to.have.property('id', 'james-bond')
    expect(result).to.not.have.property('name')
    expect(result).to.not.have.property('age')
    expect(result).to.have.property('code', '007')
  })

})