import log from '../utils/log';

export default logger => (
  {
    onError: (handler, next) => {
      if (
        handler.error.constructor.super_ &&
        handler.error.constructor.super_.name === 'HttpError'
      ) {
        const headers = handler.response &&
          handler.response.headers ? handler.response.headers : {};
        if (handler.error.details && Array.isArray(handler.error.details)) {
          handler.response = {
            headers,
            statusCode: handler.error.statusCode,
            body: JSON.stringify({
              errors: handler.error.details.map((dtls) => {
                const message = dtls.params &&
                  dtls.params.allowedValues ?
                  `${dtls.message} ${dtls.params.allowedValues}` : dtls.message;
                return {
                  message,
                  name: dtls.dataPath.split('.').pop()
                };
              })
            })
          };
        } else {
          handler.response = {
            headers,
            statusCode: handler.error.statusCode,
            body: JSON.stringify({
              message: handler.error.message
            })
          };
        }
        log(logger, { event: handler.event, error: handler.error }, 'error');

        return next();
      }
      return next(handler.error);
    }
  }
);
