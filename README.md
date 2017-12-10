# @rappopo/dab

**WARNING**: all of these are for dummies only!!! If you're considered yourself as a kungfu master, than you'd probably better to look for masterpieces like [Waterline](https://github.com/balderdashy/waterline) or [Sequelize](https://github.com/sequelize/sequelize) instead!!!

But if you're a dummy like me, then welcome to the party! Yay!! Finally a database access for fools!!! With lots of stuff and magic!!!!

## Background

Rappopo DAB is a kind of database abstraction layer which focuses on how to access and work with data easily. It won't be a very sophisticated and overly complex library. On the contrary, it'll only support the most basic operations. Not because we don't need it, but simply because I'm too stupid & lazy to write one :)

In my work as a lousy programmer right now, I have to work with many different database. Be it relational or NoSQL. And through all the times, I have to face the same problem over and over again: different ways to access the data, learning it's query language, and so on. The list grows very quickly.

That's why this project is born. It should helps lazy and stupid people like me to get more time to drink beer. Not learning a new alien language over-and-over again.

Existing libraries are way to complex for me. I only need the most basic ones: queryable through MongoDB-like query language, pagination mechanism. And simple import & export data. I also a true fan of RESTful APIs, so why don't I blindly copy their way to get, create, update & remove records? No more learning! More time for beer!! 

## Usage

**For developers**: this package gives you a basic class and guide lines on how to write package for some particular database. All you need to do is just extends this basic class and write methods according to its specification.

**For end user**: never use this package directly, because it won't gives you anything than useless stuffs! Instead, pick one of its implementation library below that match the database you're currently working with.

If, for example, you want to change the database later, the only thing you need to do is just requiring a different library and put its options. Everything else should be the same.

Example (development):

```javascript
var Dab = require('@rappopo/dab-ne'),
  dab = new Dab({ dbName: 'mydb' })

dab.find().then(function (results) => { ... })
```

And later in production, just change to this:

```javascript
var Dab = require('@rappopo/dab-couch'),
  dab = new Dab({ url: 'http://localhost:5984', dbName: 'mydb' })

// everything below this line is still the same
dab.find().then(function (results) => { ... })
```

## Methods

All methods should return promises. Callback can be used by chaining the promise with `.asCallback(fn)`

Example:

```javascript
...
// promise-way
findOne('my-doc')
.then(function (result) {
  console.log(result)
})
.catch(function (err) {
  console.log(err)
})

// callback-way
findOne('my-doc').asCallback(function (err, result) {
  if (err)
    console.log(err)
  else
    console.log(result)
})
```

* [`find (params)`](doc/FIND.md): query specific document from selected database using MongoDB-style query language
* [`findOne (id, params)`](doc/FINDONE.md): find document matched with id provided
* [`create (body, params)`](doc/CREATE.md): create a new document
* [`update (id, body, params)`](doc/UPDATE.md): update an existing document
* [`remove (id, params)`](doc/REMOVE.md): remove an existing document
* [`bulkCreate (body, params)`](doc/BULKCREATE.md): create many new documents in one call
* [`bulkUpdate (body, params)`](doc/BULKUPDATE.md): update many existing documents in one call
* [`bulkRemove (body, params)`](doc/BULKREMOVE.md): remove many existing documents in one call
* [`copyFrom (source, params)`](doc/COPYFROM.md): copy from another datasource or json file to the current one
* [`copyTo (dest, params)`](doc/COPYTO.md): copy from actual datasource to another one or save as json file
* [Method aliases](doc/ALIAS.md)

## Implementation

* [@rappopo/dab-couch](https://github.com/rappopo/dab-couch) for CouchDB 2.0 and above
* [@rappopo/dab-es](https://github.com/rappopo/dab-es) for Elasticsearch
* [@rappopo/dab-knex](https://github.com/rappopo/dab-knex) for KnexJS
* [@rappopo/dab-memory](https://github.com/rappopo/dab-memory) a custom lodash based memory database
* [@rappopo/dab-mongo](https://github.com/rappopo/dab-mongo) for MongoDB
* [@rappopo/dab-ne](https://github.com/rappopo/dab-ne) for NeDB
* [@rappopo/dab-pouch](https://github.com/rappopo/dab-pouch) for PouchDB
* [@rappopo/dab-redis](https://github.com/rappopo/dab-redis) for Redis

## Misc

* Donation: Bitcoin **16HVCkdaNMvw3YdBYGHbtt3K5bmpRmH74Y**


## License

(The MIT License)

Copyright © 2017 Ardhi Lukianto <ardhi@lukianto.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.