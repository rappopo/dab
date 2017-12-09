'use strict'

const chai = require('chai'),
  chaiAsPromised = require('chai-as-promised'),
  chaiSubset = require('chai-subset'),
  expect = chai.expect

chai.use(chaiSubset)
chai.use(chaiAsPromised)

const Cls = require('../index')

describe('delFakeGetReal', function () {
  it('should return a document with id renamed to the default one and the true id', function () {
    const cls = new Cls({
      idSrc: 'id',
      idDest: 'myid'
    })
    var [dest, id] = cls.delFakeGetReal({ 
      myid: 'james-bond',
      name: 'James Bond'
    })

    expect(dest).to.have.property('id').that.is.equal('james-bond')
    expect(dest).to.not.have.property('myid')
    expect(dest).to.have.property('name').that.is.equal('James Bond')
    expect(id).to.equal('james-bond')
  })

})