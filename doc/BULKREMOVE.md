# bulkRemove(body, params)

Method for removing many documents in one shot.

## Body Request

Body is always an array of strings or numbers. Those represent the **id** of its corresponding documents

Example:

```javascript
[ 'james-bond', 'jack-bauer-001', 'johnny-english', ... ]
```

## Response

Method should always return a response, eventhough one or more removal could fail. If failed, those corresponding rows should tell why it failed. The order of removal result should match with the order of body request.

Promise rejection error should only occour when something very bad happened within the script.

Example:

```javascript
{
  success: true,
  stat: {
    ok: 1,
    fail: 2,
    total: 3
  },
  data: [
    { _id: 'james-bond', success: true },
    { _id: 'jack-bauer-001', success: false, message: 'Not found' },
    { _id: 'johnny-english', success: false, message: 'Not found' }
  ]
}
```


