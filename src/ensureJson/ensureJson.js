import createError from 'http-errors';

export default () => (
  {
    before: (handler, next) => {
      const applicationJsonRegExp = /application\/json(;charset=utf-8)?/g;
      if (handler.event && handler.event.headers) {
        if (applicationJsonRegExp.test(handler.event.headers['Content-Type'])) {
          return next();
        } else {
          const error = new createError(
            406,
            'Unsupported content-type, must be application/json'
          );
          return next(error);
        }
      }
      return next();
    }
  }
);
