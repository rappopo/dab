'use strict'

const chai = require('chai'),
  chaiAsPromised = require('chai-as-promised'),
  chaiSubset = require('chai-subset'),
  expect = chai.expect

chai.use(chaiSubset)
chai.use(chaiAsPromised)

const Cls = require('../index')

describe('_notImplemented', function () {
  it('should yield error as promise', function () {
    const cls = new Cls()
    return expect(cls._notImplemented()).to.eventually.rejectedWith('Not implemented')
  })

  it('should yield error as callback', function (done) {
    const cls = new Cls()
    cls._notImplemented().asCallback(function(err, result) {
      expect(err).to.have.property('message').that.is.equal('Not implemented')
      done()
    })
  })
})