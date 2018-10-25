# middyjs-middleware

Middleware for use with middyjs 🛵 [middyjs](https://github.com/middyjs/middy)

## Setup

#### Install with `npm` or `yarn` (preferred)

```bash
npm i @seedrs/middyjs-middleware --save
```

##### OR

```bash
yarn add @seedrs/middyjs-middleware
```

## Available middleware

### ensureJson

This middleware is used to ensure the client has set the
Content-Type header to application/json when sending a request body.
A 406 error is returned when application/json is not present in the
Content-Type header. To ensure that header names are normalized use in
conjunction with [middyjs/middlewares/httpHeaderNormalizer](https://github.com/middyjs/middy/blob/master/docs/middlewares.md#httpheadernormalizer) and with [middyjs/middlewares/jsonBodyParser](https://github.com/middyjs/middy/blob/master/docs/middlewares.md#jsonbodyparser) to parse the incoming body for you.

```javascript
const middy = require('middy');
const {
  httpHeaderNormalizer,
  jsonBodyParser
} = require('middyjs/middlewares');
const { ensureJson } = require('@seedrs/middyjs-middleware');

const handler = middy((event, context, cb) => {
  return cb(null, {});
})
.use(httpHeaderNormalizer())
.use(ensureJson())
.use(jsonBodyParser())
.use(httpErrorHandler(logger);
```

### httpErrorHandler

This middleware is used to catch any errors thrown in your application
code and return a formatted message using errors created with
[jshttp/http-errors](https://github.com/jshttp/http-errors). Errors are logged
by the logger passed as the argument to the middleware. Intended for use
with [node-bunyan](https://github.com/trentm/node-bunyan) and [@seedrs/bunyan-seedrs-serverless-serializer](https://github.com/Seedrs/bunyan-seedrs-serverless-serializer).

```javascript
const middy = require('middy');
const createError = require('http-errors');
const { httpErrorHandler } = require('@seedrs/middyjs-middleware');

const handler = middy((event, context, cb) => {
  const error = createError.NotFoundError();
  return cb(error);
})
.use(httpErrorHandler(logger));
```

### dynamodbStreamErrorHandler

This middleware will log errors when consuming a dynamodb stream. It is
intended for use with [node-bunyan](https://github.com/trentm/node-bunyan) and [@seedrs/bunyan-seedrs-serverless-serializer](https://github.com/Seedrs/bunyan-seedrs-serverless-serializer).

```javascript
const middy = require('middy');
const { dynamodbStreamErrorHandler
} = require('@seedrs/middyjs-middleware');

const handler = middy((event, context, cb) => {
  throw new Error('Whoops');
})
.use(dynamodbStreamErrorHandler(logger));
```

### dynamodbStreamFilter

This middleware filters out unwanted events and ends the
lambda execution early if there are no matching events in the stream. In the example below the
business logic will only execute when there are Records with the INSERT
event type.

```javascript
const middy = require('middy');
const { dynamodbStreamFilter } = require('@seedrs/middyjs-middleware');

const handler = middy((event, context, cb) => {
  //Some business logic runs when there are INSERT events
})
.use(dynamodbStreamFilter({ eventName: 'INSERT' }));
```

### dynamodbStreamParser

This middleware parses and extracts fields specified in the
event. You can specify either to extract from the OldImage or the
NewImage (if your stream is configured to show both) or specify either
OldImage or NewImage.

```javascript
const middy = require('middy');
const { dynamodbStreamParser } = require('@seedrs/middyjs-middleware');

const handler = middy((event, context, cb) => {
  console.log(event.Records);
  /* Shown below is the parsed stream objects
  [{
    {
      OldImage: {
        key_one: 1
      },
      NewImage: {
        key_one: 2
      }
    }
  }]
  */
})
.use(dynamodbStreamParser({
  NewImage: [
    'key_one'
  ],
  OldImage: [
    'key_one'
  ]
});
```

### s3ErrorHandler

This middleware is intended to be used with [node-bunyan](https://github.com/trentm/node-bunyan) and [@seedrs/bunyan-seedrs-serverless-serializer](https://github.com/Seedrs/bunyan-seedrs-serverless-serializer). It logs the error produced along with the S3 event that triggered the invocation.

```javascript
const middy = require('middy');
const { httpErrorHandler } = require('@seedrs/middyjs-middleware');

const handler = middy((event, context, cb) => {
  //Some business logic
})
.use(s3ErrorHandler(logger));
```

#### Usage without bunyan and seedrs/bunyan-seedrs-serverless-serializer

It is possible to provide a custom object that uses your own logging
system with these middlewares. However we suggest using bunyan with our
serializers to help parse and log events and responses as JSON. Shown
below is an example using the default console object.

```javascript
const middy = require('middy');
const { httpErrorHandler } = require('@seedrs/middyjs-middleware');

const handler = middy((event, context, cb) => {
  //Some business logic
})
.use(httpErrorHandler(console));
```

## Contribute

To contribute to the project, please read the [guide](CONTRIBUTING.md).
