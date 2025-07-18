const asyncHandler = require('../utils/asyncHandler');

const validate = (schema) => asyncHandler(async (req, res, next) => {
  const validationOptions = {
    abortEarly: false,
    stripUnknown: true,
  };

  try {
    const validatedBody = await schema.validateAsync(req.body, validationOptions);
    
    req.body = validatedBody;
    
    next();
  } catch (error) {
    const errorMessages = error.details.map((detail) => detail.message);

    const validationError = new Error(errorMessages.join(', '));
    res.status(400);
    
    next(validationError);
  }
});

module.exports = validate;