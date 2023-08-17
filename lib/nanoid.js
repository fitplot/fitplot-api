const NanoidAsync = require('nanoid/async');
const z = require('zod');

const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz';
const ID_LENGTH = 12;

/**
 * @type {NanoidAsync.nanoid}
 */
const nanoid =
  global._nanoid ||
  (global._nanoid = NanoidAsync.customAlphabet(ALPHABET, ID_LENGTH));

const NanoIdSchema = z.string().min(ID_LENGTH).max(ID_LENGTH);

module.exports = {
  nanoid,
  NanoIdSchema,
};
