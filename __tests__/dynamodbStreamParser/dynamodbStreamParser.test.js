import middy from 'middy';
import oldImage from 'fixtures/dynamodbParserOldImage.json';
import oldImageAndNewImage from 'fixtures/dynamodbParserOldImageAndNewImage.json';
import newImage from 'fixtures/dynamodbParserNewImage.json';
import { dynamodbStreamParser } from '../../src';

describe('middleware/dynamoDBStreamParser', () => {
  describe('when a record has OldImage sections which match the config', () => {
    it('returns normalised key value pairs per section', () => {
      const handler = middy((event, context, cb) => cb(null, event));
      handler.use(dynamodbStreamParser({
        OldImage: [
          'parent_resource',
          'file_type_tag_name_bucket'
        ]
      }));
      const myEvent = { ...oldImage };
      handler(myEvent, {}, () => {
        expect(handler.event.Records).toEqual([
          {
            OldImage: {
              parent_resource: 'business::1::campaign::1',
              file_type_tag_name_bucket: 'document::legal_document::something.txt::private'
            }
          }
        ]);
      });
    });
  });
  describe('when a record has NewImage sections which match the config', () => {
    it('returns normalised key value pairs per section', () => {
      const handler = middy((event, context, cb) => cb(null, event));
      handler.use(dynamodbStreamParser({
        NewImage: [
          'parent_resource',
          'file_type_tag_name_bucket'
        ]
      }));
      const myEvent = { ...newImage };
      handler(myEvent, {}, () => {
        expect(handler.event.Records).toEqual([
          {
            NewImage: {
              parent_resource: 'business::1::campaign::1',
              file_type_tag_name_bucket: 'document::legal_document::something.txt::private'
            }
          }
        ]);
      });
    });
  });
  describe('when a record has OldImage and NewImage sections which match the config', () => {
    it('returns normalised key value pairs per section', () => {
      const handler = middy((event, context, cb) => cb(null, event));
      handler.use(dynamodbStreamParser({
        NewImage: [
          'parent_resource',
          'file_type_tag_name_bucket'
        ],
        OldImage: [
          'parent_resource',
          'file_type_tag_name_bucket'
        ]
      }));
      const myEvent = { ...oldImageAndNewImage };
      handler(myEvent, {}, () => {
        expect(handler.event.Records).toEqual([
          {
            OldImage: {
              parent_resource: 'business::1::campaign::1',
              file_type_tag_name_bucket: 'document::legal_document::something.txt::private'
            },
            NewImage: {
              parent_resource: 'business::1::campaign::1',
              file_type_tag_name_bucket: 'document::legal_document::something.txt::private'
            }
          }
        ]);
      });
    });
  });
});
