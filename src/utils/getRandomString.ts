import crypto from 'crypto';
export function getRandomString(maxLen?: number) {
  const id = crypto.randomBytes(20).toString('hex');

  return maxLen ? id.substring(0, maxLen) : id;
}
