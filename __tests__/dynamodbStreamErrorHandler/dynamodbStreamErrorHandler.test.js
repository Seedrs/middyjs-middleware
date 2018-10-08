import middy from 'middy';
import logger from 'mocks/logger';
import { dynamodbStreamErrorHandler } from '../../src';

describe('middleware/dynamoStreamErrorHandler', () => {
  it('handles and logs errors', (done) => {
    const handler = middy(() => {
      throw new Error('Something went wrong');
    });

    handler.use(dynamodbStreamErrorHandler(logger));
    handler({}, {}, (error) => {
      expect(error.message).toEqual('Something went wrong');
      expect(logger.error).toHaveBeenCalledWith({
        dynamodbStreamEvent: {},
        error: new Error('Something went wrong')
      });
      done();
    });
  });
});
