import log from '../utils/log';

export default logger => (
  {
    onError: (handler, next) => {
      handler.response = { success: false };
      log(logger, { s3Event: handler.event, error: handler.error }, 'error');

      return next(handler.error);
    }
  }
);
