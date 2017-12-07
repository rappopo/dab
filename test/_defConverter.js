'use strict'

const chai = require('chai'),
  chaiAsPromised = require('chai-as-promised'),
  chaiSubset = require('chai-subset'),
  expect = chai.expect

chai.use(chaiSubset)
chai.use(chaiAsPromised)

const Cls = require('../index')

describe('_defConverter', function () {
  it('should return document with column _id renamed to myid', function () {
    const cls = new Cls({
      idDest: 'myid'
    })
    var dest = cls._defConverter({ 
      _id: 'james-bond',
      name: 'James Bond'
    })
    expect(dest).to.have.property('myid').that.is.equal('james-bond')
    expect(dest).to.have.property('name').that.is.equal('James Bond')
  })

  it('should return document with column id renamed to myid', function () {
    const cls = new Cls({
      idSrc: 'id',
      idDest: 'myid'
    })
    var dest = cls._defConverter({ 
      id: 'james-bond',
      name: 'James Bond'
    })
    expect(dest).to.have.property('myid').that.is.equal('james-bond')
    expect(dest).to.have.property('name').that.is.equal('James Bond')
  })

})