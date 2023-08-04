const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz';

async function factory() {
  const { customAlphabet } = await import('nanoid/async');
  return customAlphabet(ALPHABET, 12);
}

module.exports = { factory };
