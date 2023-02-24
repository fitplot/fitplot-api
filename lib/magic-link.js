const dayjs = require('dayjs');
const z = require('zod');

const { encrypt, decrypt } = require('./encryption');

const MAGIC_LINK_EXPIRATION_TIME = 1000 * 60 * 30; // thirty minutes
const MAGIC_PARAM = 'dust';

function getMagicLink({ email, domainUrl }) {
  const payload = {
    email,
    domainUrl,
    createdAt: dayjs().toISOString(),
  };
  const encrypted = encrypt(JSON.stringify(payload));
  const params = new URLSearchParams();
  params.set(MAGIC_PARAM, encrypted);
  return `/magic?=${params.toString()}`;
}

function crackMagicLink(ctx) {
  const data = JSON.parse(decrypt(ctx.query[MAGIC_PARAM]));

  const { success, data: payload } = z
    .object({
      email: z.string().email(),
      domainUrl: z.string(),
      createdAt: z.string(),
    })
    .safeParse(data);

  if (!success)
    ctx.throw(401, `Magic link is not valid. Please request a new one.`);

  const deadline = dayjs(payload.createdAt).add(MAGIC_LINK_EXPIRATION_TIME);
  if (dayjs().isAfter(deadline))
    ctx.throw(401, 'Magic link expired. Please request a new one.');

  return payload;
}

module.exports = {
  MAGIC_LINK_EXPIRATION_TIME,
  MAGIC_PARAM,
  getMagicLink,
  crackMagicLink,
};
