import log from '../utils/log';
import createError from 'http-errors';

const isEmpty = body => Object.keys(body).length === 0;

const setStatusCode = (handler) => {
  if (handler.response && handler.response.statusCode && handler.response.body) {
    return handler.response.statusCode;
  } else if (!handler.response.body || isEmpty(handler.response.body)) {
    return 204;
  } else if (handler.response.body && !handler.response.statusCode) {
    return 200;
  }
};

const safeStringify = (handler, logger) => {
  if (handler.response.body && !isEmpty(handler.response.body)) {
    return JSON.stringify(handler.response.body);
  } else {
    return null;
  }
};

export default logger => (
  {
    after: (handler, next) => {
      const statusCode = setStatusCode(handler);
      const stringifiedBody = safeStringify(handler, logger);
      log(logger, { response: { ...handler.response } }, 'info');
      handler.response = {
        statusCode,
        body: stringifiedBody,
        headers: handler.response.headers
      };

      return next();
    }
  }
);
