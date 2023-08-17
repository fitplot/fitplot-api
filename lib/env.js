const z = require('zod');
const dotenv = require('dotenv');

const EnvSchema = z.object({
  NODE_ENV: z.enum(['production', 'development']).optional(),
  PORT: z.number().default(3030),
  DATABASE_URL: z.string().url(),
  RESEND_SECRET: z.string(),
  SENTRY_DSN: z.string().url(),
  SIGNED_COOKIE_SECRET: z.string(),
  MAGIC_LINK_SECRET: z.string(),
});

/**
 * @type {z.infer<typeof EnvSchema>}
 */
const ENV = global._env || (global._env = init());

function init() {
  dotenv.config();
  const parsed = EnvSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error(
      '❌ Invalid environment variables:',
      parsed.error.flatten().fieldErrors,
    );

    throw new Error('Invalid envirmonment variables');
  }

  return parsed.data;
}

module.exports = ENV;
