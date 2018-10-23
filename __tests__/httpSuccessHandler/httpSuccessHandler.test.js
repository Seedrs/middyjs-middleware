import middy from 'middy';
import logger from 'mocks/logger';
import { httpSuccessHandler } from '../../src';

describe('middleware/httpSuccessHandler', () => {
  it('should call logger with the correct arguments', (done) => {
    const handler = middy(async () => {
      return {
        headers: {},
        statusCode: 200,
        body: {}
      };
    });
    handler.use(httpSuccessHandler(logger))
    handler({}, {}, () => {
      expect(logger.info).toHaveBeenCalledWith({
        response: { headers: {}, body: {}, statusCode: 200 }
      });
      done();
    });
  });

  it('returns the correct response', (done) => {
    const handler = middy(async () => {
      return {
        headers: {},
        statusCode: 200,
        body: { a: 'a' }
      }
    });
    handler.use(httpSuccessHandler(logger))
    handler({}, {}, (_, response) => {
      expect(response.statusCode).toBe(200);
      expect(response.headers).toEqual({});
      expect(response.body).toEqual(JSON.stringify({ a: 'a' }));
      done();
    });
  });

  describe('when statusCode is not present', () => {
    it('should default to 200', (done) => {
      const handler = middy(async () => {
        return {
          headers: {},
          body: { a: 'a' }
        }
      });
      handler.use(httpSuccessHandler(logger))
      handler({}, {}, (_, response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(JSON.stringify({ a: 'a' }));
        done();
      });
    });
  });

  describe('when there is no body defined', () => {
    it('should default to 204', (done) => {
      const handler = middy(async () => {
        return {
          headers: {}
        }
      });
      handler.use(httpSuccessHandler(logger))
      handler({}, {}, (_, response) => {
        expect(response.statusCode).toBe(204);
        done();
      });
    });
  });

  describe('when the response is empty', () => {
    it('should return 204', (done) => {
      const handler = middy(async () => {
        return {
          body: {}
        };
      });
      handler.use(httpSuccessHandler(logger))
      handler({}, {}, (_, response) => {
        expect(response.body).toBe(null);
        expect(response.statusCode).toBe(204);
        done();
      });
    });
  });
});
