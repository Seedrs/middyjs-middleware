export default (config = {}) => (
  {
    before: (handler, next) => {
      if (handler.event && handler.event.Records) {
        const options = Object.assign({}, config);
        const keys = Object.keys(options);
        const newRecords = handler.event.Records.reduce((acc, curr) => {
          const source = curr.dynamodb;
          const translated = {};
          for (const key in keys) {
            const members = options[keys[key]];
            translated[keys[key]] = {};
            for (const member in members) {
              const entries = Object.entries(source[keys[key]][members[member]]);
              /*eslint-disable-next-line prefer-destructuring*/
              translated[keys[key]][members[member]] = entries[0][1];
            }
          }
          return acc.concat(translated);
        }, []);
        handler.event.Records = newRecords;

        if (handler.event.Records.length > 0) {
          return next();
        } else {
          return handler.callback(
            null,
            `No records matching the shape ${JSON.stringify(options, null, 2)}`
          );
        }
      }
    }
  }
);
