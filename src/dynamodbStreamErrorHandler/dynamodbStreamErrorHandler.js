export default logger => (
  {
    onError: (handler, next) => {
      handler.response = { success: false };
      logger.error({ error: handler.error, dynamodbStreamEvent: handler.event });

      return next(handler.error);
    }
  }
);
