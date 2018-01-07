'use strict'

const chai = require('chai'),
  chaiAsPromised = require('chai-as-promised'),
  chaiSubset = require('chai-subset'),
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
})