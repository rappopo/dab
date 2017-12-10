# @rappopo/dab

**WARNING**: all of this is for node dummies only!!! If you're considered yourself as a kungfu master, than you'd probably better take a look for masterpieces like [Waterline](https://github.com/balderdashy/waterline) or [Sequelize](https://github.com/sequelize/sequelize) instead!!!

But if you're a dummy like me, then welcome to the party! Yay!! Finally a database access for fools!!! With lots of stuff and magic!!!!

## Overview

...

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