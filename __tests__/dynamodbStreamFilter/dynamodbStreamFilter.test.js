import middy from 'middy';
import dynamodbStream from 'fixtures/dynamodbStream.json';
import { dynamodbStreamFilter } from '../../src';

describe('middleware/dynamoDBStreamFilter', () => {
  describe('when a record have the provided eventName', () => {
    it('calls next with the matching record', (done) => {
      const handler = middy((event, context, cb) => cb(null, event));
      handler.use(dynamodbStreamFilter({ eventName: 'REMOVE' }));
      const myEvent = { ...dynamodbStream };
      handler(myEvent, {}, () => {
        expect(handler.event.Records.length).toBe(1);
        done();
      });
    });
  });
  describe('when records have the provided eventName', () => {
    it('calls next with the matching records', (done) => {
      const handler = middy((event, context, cb) => cb(null, event));
      handler.use(dynamodbStreamFilter({ eventName: 'INSERT' }));
      const myEvent = { ...dynamodbStream };
      handler(myEvent, {}, () => {
        expect(handler.event.Records.length).toBe(2);
        done();
      });
    });
  });
  describe('when record(s) do not have the provided eventName', () => {
    it('calls next with null', (done) => {
      const handler = middy((event, context, cb) => cb(null, event));
      handler.use(dynamodbStreamFilter({ eventName: 'MODIFY' }));
      const myEvent = { ...dynamodbStream };
      handler(myEvent, {}, (error, response) => {
        expect(response).toBe('No records of eventName MODIFY');
        done();
      });
    });
  });
});
