/**
 * Express 5 now natively handles Promise rejections in route handlers.
 * While this wrapper is technically redundant for basic async routes in v5,
 * it is maintained here for consistency across older middleware patterns
 * and to ensure any non-standard async executions are caught by the global error handler.
 */
const asyncHandler = (fn) => (req, res, next) => {
  // Promise.resolve ensures both sync and async functions are handled uniformly
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
