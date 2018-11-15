import log from '../utils/log';

export default logger => (
  {
    onError: (handler, next) => {
      const headers = handler.response &&
        handler.response.headers ? handler.response.headers : {};
      if (
        handler.error.constructor.super_ &&
        handler.error.constructor.super_.name === 'HttpError'
      ) {
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
      } else if (handler.error) {
        handler.response = {
          headers,
          statusCode: 500,
          body: JSON.stringify({
            message: 'Internal server error'
          })
        };
        log(logger, { event: handler.event, error: handler.error }, 'error');
      }
      return next();
    }
  }
);
