export default config => (
  {
    before: (handler, next) => {
      if (handler.event && handler.event.Records) {
        const defaultOptions = { eventName: 'REMOVE' };
        const options = Object.assign({}, defaultOptions, config);
        handler.event.Records = handler.event.Records.filter(
          record => record.eventName === options.eventName
        );
        if (handler.event.Records.length > 0) {
          return next();
        } else {
          return handler.callback(null, `No records of eventName ${options.eventName}`);
        }
      }
    }
  }
);
