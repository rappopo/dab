# copyTo(destination, params)

Use this method to export your datasource.

## Document destination (mixed, required)

If destination is a json file, than all resulting documents that matched the params query will be saved to the file, e.g:

```javascript
...
dab.copyTo('/path/of/my/file.json', {
  query: {
    age: {
      $gt: 20
    }
  },
  limit: 10
}).then(function (result) { ... })
...
```

But if destination is another DAB instance, then your current instance will be queried and copied over as chunks. E.g:

```javascript
var dab = new DabCouch({ ... }),
  destination = new DabMemory()

dab.copyTo(destination, {
  query: {
    age: {
      $gt: 20
    }
  },
  limit: 10
}).then(function (result) { ... })
```

## Parameter (optional)

`query`: query target datasource, optional, defaults to `{}`.

`limit`: max. number of rows per page/chunk. Optional, defaults to 25. This is NOT the max. rows you're gonna get. You'll always get ALL rows matched with your query. It is here to limit the query results so it won't crash your server. The higher you put the limit, the faster to get things done. But it'll also introduce more danger as your server will consume much more memories.

`withDetail`: if *true*, like in all bulk methods, result will carry the detail of every transaction. Default: *false*

## Response

Method should always return a response, eventhough one or more insertion could fail. If failed, those corresponding rows should tell why it failed, if enabled through `withDetail` parameter above. 

Promise rejection error should only occour when something very bad happened within the script.

Example:

```javascript
{
  success: true,
  stat: {
    ok: 2,
    fail: 1,
    total: 3
  },
  detail: [
    { _id: 'james-bond', success: false, message: 'Exists' },
    { _id: 'jack-bauer', success: true },
    { _id: '337b116d-650e-4581-8bef-7b119467b05c', success: true }
  ]
}
```

