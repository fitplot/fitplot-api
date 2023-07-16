const crypto = require('node:crypto');

const algorithm = 'aes-256-gcm';

const ENCRYPTION_KEY = crypto.scryptSync(
  process.env.MAGIC_LINK_SECRET,
  'salt',
  32,
);
const IV_LENGTH = 12;
const UTF8 = 'utf8';
const HEX = 'hex';

function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(algorithm, ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text, UTF8, HEX);
  encrypted += cipher.final(HEX);
  const authTag = cipher.getAuthTag();
  return `${iv.toString(HEX)}:${authTag.toString(HEX)}:${encrypted}`;
}

function decrypt(text) {
  const [ivPart, authTagPart, encryptedText] = text.split(':');
  if (!ivPart || !authTagPart || !encryptedText) {
    throw new Error('Invalid text.');
  }

  const iv = Buffer.from(ivPart, HEX);
  const authTag = Buffer.from(authTagPart, HEX);
  const decipher = crypto.createDecipheriv(algorithm, ENCRYPTION_KEY, iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encryptedText, HEX, UTF8);
  decrypted += decipher.final(UTF8);
  return decrypted;
}

module.exports = {
  encrypt,
  decrypt,
};
