export const validateRequestMiddleware = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      //   const errorMessages = result.error.errors.map((err) => err.message);
      //   const error = errorMessages.join(", ");
      const errorArray = JSON.parse(result.error.message);
      const errorMessages = errorArray.map(
        (err) => `${err.path.join(".")} - ${err.message}`,
      );
      return res.status(400).json({
        error: "Invalid request data",
        details: errorMessages,
      });
    }
    next();
  };
};
