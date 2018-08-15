'use strict'

const chai = require('chai')
const expect = chai.expect
const chaiSubset = require('chai-subset')

chai.use(chaiSubset)

const Cls = require('../dab')

describe('Dab - setOptions', function () {
  it('should return the default options', function () {
    const cls = new Cls()
    expect(cls.options).to.eql({
      limit: 25,
      options: {}
    })
  })

  it('should return the merged options', function () {
    const cls = new Cls({
      key1: 'key1',
      key2: 'key2'
    })
    expect(cls.options).to.eql({
      limit: 25,
      key1: 'key1',
      key2: 'key2',
      options: {}
    })
  })
})
