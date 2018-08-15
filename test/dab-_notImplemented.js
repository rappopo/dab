'use strict'

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const chaiSubset = require('chai-subset')
const expect = chai.expect

chai.use(chaiSubset)
chai.use(chaiAsPromised)

const Cls = require('../dab')

describe('Dab - _notImplemented', function () {
  it('should yield error as promise', function () {
    const cls = new Cls()
    return expect(cls._notImplemented()).to.eventually.rejectedWith('Not implemented')
  })
})
