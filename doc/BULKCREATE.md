# bulkCreate(body, params)

Method for creating/inserting many documents in one shot.

## Body Request

Body is always an array of objects. If no **id** is found in the object, it'll be generated automatically for you. Example:

```javascript
[
  { _id: 'james-bond', name: 'James Bond' },
  { _id: 'jack-bauer', name: 'Jack Bauer' },
  { name: 'Johnny English' }   // id isn't provided here, it'll be created automatically
  ...
]
```

## Parameter (optional)

The optional parameter object:

`withDetail`: default is *false*. If *true*, details of operation will be returned. It is an array of objects in the same order as body request above. See example below.

## Response

Method should always return a response, eventhough one or more insertion could fail. If failed, those corresponding rows should tell why it failed, if enabled through `withDetail` parameter above. 

The order of insertion result should match with the order of body request.

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


