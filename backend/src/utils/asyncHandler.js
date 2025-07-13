const asyncHandler = (controller) => {
  const wrappedController = (req, res, next) => {
    const controllerPromise = controller(req, res, next);
    Promise.resolve(controllerPromise).catch((error) => {
      next(error);
    });
  };

  return wrappedController;
};

module.exports = asyncHandler;