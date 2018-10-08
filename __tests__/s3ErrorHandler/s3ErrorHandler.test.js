import middy from 'middy';
import logger from 'mocks/logger';
import { s3ErrorHandler } from '../../src';

describe('middleware/s3ErrorHandler', () => {
  it('handles and logs errors', (done) => {
    const handler = middy(() => {
      throw new Error('Something went wrong');
    });

    handler.use(s3ErrorHandler(logger));
    handler({}, {}, (error) => {
      expect(error.message).toEqual('Something went wrong');
      expect(logger.error).toHaveBeenCalledWith({
        s3Event: {},
        error: new Error('Something went wrong')
      });
      done();
    });
  });
});
