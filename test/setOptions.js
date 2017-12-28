'use strict'

const chai = require('chai'),
  expect = chai.expect,
  chaiSubset = require('chai-subset')

chai.use(chaiSubset)

const Cls = require('../index')

describe('setOptions', function () {
  it('should return the default options', function () {
    const cls = new Cls()
    expect(cls.options).to.eql({
      limit: 25,
      ns: 'default',
      options: {}
    })
  })

  it('should return the merged options', function () {
    const cls = new Cls({
      ns: 'test',
      key1: 'key1',
      key2: 'key2'
    })
    expect(cls.options).to.eql({
      limit: 25,
      ns: 'test',
      key1: 'key1',
      key2: 'key2',      
      options: {}
    })
  })

})


