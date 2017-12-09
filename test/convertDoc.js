'use strict'

const chai = require('chai'),
  chaiAsPromised = require('chai-as-promised'),
  chaiSubset = require('chai-subset'),
  expect = chai.expect

chai.use(chaiSubset)
chai.use(chaiAsPromised)

const Cls = require('../index')

describe('convertDoc', function () {
  it('should return a document id renamed to myid', function () {
    const cls = new Cls({
      idDest: 'myid'
    })
    var dest = cls.convertDoc({ 
      _id: 'james-bond',
      name: 'James Bond'
    })

    expect(dest).to.have.property('myid').that.is.equal('james-bond')
    expect(dest).to.have.property('name').that.is.equal('James Bond')
  })

  it('should return an array of documents with id renamed to myid', function () {
    const cls = new Cls({
      idDest: 'myid'
    })
    var dest = cls.convertDoc([
      { _id: 'james-bond', name: 'James Bond' },
      { _id: 'jack-bauer', name: 'Jack Bauer' }
    ])

    expect(dest).to.containSubset([{ myid: 'james-bond', name: 'James Bond' }])
    expect(dest).to.containSubset([{ myid: 'jack-bauer', name: 'Jack Bauer' }])
  })

  it('should return an array of documents with id renamed to myid and value of name reset uppercased', function () {
    const cls = new Cls({
      idDest: 'myid'
    })

    var input = [
      { _id: 'james-bond', name: 'James Bond' },
      { _id: 'jack-bauer', name: 'Jack Bauer' }
    ]

    var converter = function (data) {
      data.name = data.name.toUpperCase()
      return data
    }

    var dest = cls.convertDoc(input, { converter: converter })

    expect(dest).to.containSubset([{ myid: 'james-bond', name: 'JAMES BOND' }])
    expect(dest).to.containSubset([{ myid: 'jack-bauer', name: 'JACK BAUER' }])
  })


})