const { ZodError } = require('zod');

async function validate(data, schema, name) {
  if (!schema) {
    return undefined;
  }

  const parsed = await schema.safeParseAsync(data);

  if (!parsed.success) {
    parsed.error.name = `${parsed.error.name}: ${name}`;
    return parsed.error;
  }

  return parsed.data;
}

function validationMiddleware(validation) {
  if (!isValidation(validation)) {
    return noopMiddleware;
  }

  return async function (ctx, next) {
    // Input validation
    let inputErrors = [];

    const [params, query, body] = await Promise.all([
      validate(ctx.request.params, validation.params, 'Route Params'),
      validate(ctx.request.query, validation.query, 'Querystring'),
      validate(ctx.request.body, validation.body, 'Request Body'),
    ]);

    if (params) {
      if (params instanceof ZodError) {
        inputErrors.push(params);
      } else {
        Object.keys(params).forEach((key) => {
          ctx.request.params[key] = params[key];
        });
      }
    }

    if (query) {
      if (query instanceof ZodError) {
        inputErrors.push(query);
      } else {
        Object.keys(query).forEach((key) => {
          ctx.request.query[key] = query[key];
        });
      }
    }

    if (body) {
      if (body instanceof ZodError) {
        inputErrors.push(body);
      } else {
        Object.keys(body).forEach((key) => {
          ctx.request.body[key] = body[key];
        });
      }
    }

    if (inputErrors.length) {
      ctx.response.status = 400;
      ctx.type = 'json';
      ctx.body = { error: inputErrors };
      ctx.app.emit('error', new Error('ValidationError', { cause: { error: inputErrors } }), ctx);

      return;
    }

    await next();

    // Output validation
    const output = await validate(ctx.body, validation.response, 'Response');

    if (!output) {
      return;
    }

    if (output instanceof ZodError) {
      ctx.throw(500);
    } else {
      ctx.body = output;
      ctx.response.body = output;
    }
  };
}

function isValidation(val) {
  const props = ['body', 'query', 'params', 'response'];

  return typeof val === 'object' ? props.some((prop) => Boolean(val[prop])) : false;
}

function noopMiddleware(ctx, next) {
  return void next();
}

module.exports = {
  validationMiddleware,
  validate,
};
