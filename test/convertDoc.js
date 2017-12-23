'use strict'

const chai = require('chai'),
  chaiAsPromised = require('chai-as-promised'),
  chaiSubset = require('chai-subset'),
  expect = chai.expect

chai.use(chaiSubset)
chai.use(chaiAsPromised)

const Cls = require('../index')

describe('convertDoc', function () {
  it('should return an array of documents with uppercased name', function () {
    const cls = new Cls()

    var input = [
      { _id: 'james-bond', name: 'James Bond' },
      { _id: 'jack-bauer', name: 'Jack Bauer' }
    ]

    var converter = function (data) {
      data.name = data.name.toUpperCase()
      return data
    }

    var dest = cls.convertDoc(input, { converter: converter })

    expect(dest).to.containSubset([{ _id: 'james-bond', name: 'JAMES BOND' }])
    expect(dest).to.containSubset([{ _id: 'jack-bauer', name: 'JACK BAUER' }])
  })


})