const { ZodError } = require('zod');

function middleware(validation) {
  if (!isValidation(validation)) {
    return noopMiddleware;
  }

  return async function (ctx, next) {
    // Input validation
    let inputErrors = [];

    const [parameters, query, body] = await Promise.all([
      validate(ctx.request.params, validation.params, 'Route Params'),
      validate(ctx.request.query, validation.query, 'Querystring'),
      validate(ctx.request.body, validation.body, 'Request Body'),
    ]);

    if (parameters) {
      if (parameters instanceof ZodError) {
        inputErrors.push(parameters);
      } else {
        for (const key of Object.keys(parameters)) {
          ctx.request.params[key] = parameters[key];
        }
      }
    }

    if (query) {
      if (query instanceof ZodError) {
        inputErrors.push(query);
      } else {
        for (const key of Object.keys(query)) {
          ctx.request.query[key] = query[key];
        }
      }
    }

    if (body) {
      if (body instanceof ZodError) {
        inputErrors.push(body);
      } else {
        for (const key of Object.keys(body)) {
          ctx.request.body[key] = body[key];
        }
      }
    }

    if (inputErrors.length > 0) {
      ctx.response.status = 400;
      ctx.type = 'json';
      ctx.body = { error: inputErrors };

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

async function validate(data, schema, name) {
  if (!schema) {
    return;
  }

  const parsed = await schema.safeParseAsync(data);

  if (!parsed.success) {
    parsed.error.name = `Validation Error in: ${name}`;
    return parsed.error;
  }

  return parsed.data;
}

function isValidation(value) {
  const properties = ['body', 'query', 'params', 'response'];

  return typeof value === 'object'
    ? properties.some((property) => Boolean(value[property]))
    : false;
}

function noopMiddleware(ctx, next) {
  return void next();
}

module.exports = middleware;
