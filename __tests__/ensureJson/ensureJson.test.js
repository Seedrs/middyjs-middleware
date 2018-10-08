import middy from 'middy';
import { ensureJson } from '../../src';

describe('middleware/ensureJson', () => {
  describe('when the content-type header is application/json;charset=utf-8', () => {
    it('calls next', (done) => {
      const handler = middy((event,context,cb) => cb(null, 'happy days'));

      handler.use(ensureJson());

      handler({
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        }
      },
      {},
      (error, response) => {
        expect(response).toBe('happy days');
        done();
      });
    });
  });

  describe('when the content-type header is not application/json', () => {
    it('calls next with a http error', (done) => {
      const handler = middy(() => 'happy days');

      handler.use(ensureJson());

      handler({ headers: { 'Content-Type': 'something-not-json' } }, {}, (error) => {
        expect(error.statusCode).toBe(406);
        expect(error.message).toEqual('Unsupported content-type, must be application/json');
        done();
      });
    });
  });

  describe('when the content-type header is application/json', () => {
    it('calls next', (done) => {
      const handler = middy((event,context,cb) => cb(null, 'happy days'));

      handler.use(ensureJson());

      handler({ headers: { 'Content-Type': 'application/json' } }, {}, (error, response) => {
        expect(response).toBe('happy days');
        done();
      });
    });
  });
});
