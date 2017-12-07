# @rappopo/dab

## Methods

All methods return promises. 

`find (params)`: query specific document from selected database using MongoDB-like query language. As parameter, pass the following object:

* `query`: query in MongoDB-like query syntax. Optional, defaults: {} (match all).
* `sort`: sort order, as an array of object. Optional. Example:

	[{ name: 'asc', age: 'desc' }] 

* `limit`: max. number of documents in one page. Optional, default: 25. Overrideable through options object.
* `page`: page number, starting from 1. Optional, defaults: 1

Example:

	{
		query: {
			age: 20
		},
		page: 1,
		limit: 25
	}

It should return object according to this schema:

	{
		success: true,
		total: 120,
		data: [
			{ id: 'james-bond', name: 'James Bond', age: 20 },
			{ id: 'jack-bauer', name: 'Jack Bauer', age: 20 },
			{ id: 'jason-bourne', name: 'Jason Bourne', age: 20 },
			...
		]
	}

If no documents could be found, it should **NOT** yield error. Instead, it sould return an empty data with total = 0.

`findOne (id, params)`: find document matched with id provided. It should return object according to this schema:

	{
		success: true,
		data: {
			_id: 'mydoc',
			title: 'My Secret Document',
			....
		}
	}

In case of error, it should return a normal node error object.
If one provides wrong id, it should also be considered as an error with the message: **Not found**

`create (body, params)`: create a new document. 

Body is a javascript object. if **id** is NOT provided, it should be created automatically. It should return the same object as above.

If object already exists, it should yield an error with the message: **Exists**

`update (id, body, params)`: update an existing document

`remove (id, params)`: remove an existing document

`bulkCreate (body, params)`: create many new documents in one shot

`bulkUpdate (body, params)`: update many existing documents in one shot

`bulkRemove (body, params)`: remove many existing documents in one shot

## Implementation

* [@rappopo/dab-couch](https://github.com/rappopo/dab-couch) for CouchDB
* [@rappopo/dab-es](https://github.com/rappopo/dab-es) for Elasticsearch
* [@rappopo/dab-knex](https://github.com/rappopo/dab-knex) for KnexJS
* [@rappopo/dab-memory](https://github.com/rappopo/dab-memory) a custom lodash based memory database
* [@rappopo/dab-mongo](https://github.com/rappopo/dab-mongo) for MongoDB
* [@rappopo/dab-ne](https://github.com/rappopo/dab-ne) for NeDB
* [@rappopo/dab-pouch](https://github.com/rappopo/dab-pouch) for PouchDB
* [@rappopo/dab-redis](https://github.com/rappopo/dab-redis) for Redis

## License

(The MIT License)

Copyright © 2017 Ardhi Lukianto <ardhi@lukianto.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.