import middy from 'middy';
import createError from 'http-errors';
import logger from 'mocks/logger';
import { httpErrorHandler } from '../../src';

describe('middleware/httpErrorHandler', () => {
  it('should skip non httpErrors', (done) => {
    const handler = middy(() => {
      throw new Error('Standard error');
    });

    handler.use(httpErrorHandler(logger));

    handler({}, {}, (error, response) => {
      expect(response).toBe(undefined);
      expect(error.message).toEqual('Standard error');
      done();
    });
  });

  it('should handle a httpError', (done) => {
    const handler = middy(() => {
      throw new createError(400,'Something missing');
    });
    handler.use({
      before: (handler, next) => {
        handler.response = { headers: { 'content-type': 'application/json' } };
        next();
      }
    })
    .use(httpErrorHandler(logger));

    handler({}, {}, (event, response) => {
      expect(response).toEqual({
        headers: { 'content-type': 'application/json' },
        statusCode: 400,
        body: JSON.stringify({
          message: 'Something missing'
        })
      });
      done();
    });
  });

  it('should handle a httpError without headers set', (done) => {
    const handler = middy(() => {
      throw new createError(400,'Something missing');
    })
    .use(httpErrorHandler(logger));

    handler({}, {}, (event, response) => {
      expect(response).toEqual({
        headers: {},
        statusCode: 400,
        body: JSON.stringify({
          message: 'Something missing'
        })
      });
      done();
    });
  });

  it('should handle a badRequest error', (done) => {
    const handler = middy(() => {
      const err = new createError(400,'Bad request');
      err.details = [
        {
          keyword: 'enum',
          dataPath: '.body.bucket',
          params: {
            allowedValues: ['public','private']
          },
          message: 'should be equal to one of the predefined values'
        }
      ];
      throw err;
    });
    handler.use({
      before: (handler, next) => {
        handler.response = { headers: { 'content-type': 'application/json' } };
        next();
      }
    })
    .use(httpErrorHandler(logger));

    handler({}, {}, (event, response) => {
      expect(response).toEqual({
        headers: { 'content-type': 'application/json' },
        statusCode: 400,
        body: JSON.stringify({
          errors: [
            {
              message: 'should be equal to one of the predefined values public,private',
              name: 'bucket'
            }
          ]
        })
      });
      done();
    });
  });

  it('should log the httpError', (done) => {
    const handler = middy(() => {
      throw new createError(400,'Bad request - request must include a key parameter');
    });
    handler.use({
      before: (handler, next) => {
        handler.response = { headers: {} };
        next();
      }
    })
    .use(httpErrorHandler(logger));

    handler({}, {}, () => {
      expect(logger.error).toHaveBeenCalledWith({
        event: {},
        error: new createError(400, 'Bad request - request must include a key parameter')
      });
      done();
    });
  });
});
