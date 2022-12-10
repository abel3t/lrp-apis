import { randomBytes } from 'crypto';

export function generatePassword(): string {
  return '12345@bC';
  const prefixPassword = ['1e', 'e5', 'o4', '0q'];
  const suffixPassword = ['$Q', 'Y$', 'P&', 'L!'];
  const PASSWORD_REGEX = new RegExp(
    /^[\dA-Za-z]+[\w!$&()*@|]+[\dA-Za-z]+$/,
    'g'
  );

  const prefix =
    prefixPassword[Math.floor(Math.random() * prefixPassword.length)];
  const suffix =
    suffixPassword[Math.floor(Math.random() * suffixPassword.length)];

  let str = prefix + randomBytes(10).toString('ascii') + suffix;
  while (!str.match(PASSWORD_REGEX)?.length) {
    str = randomBytes(10).toString('ascii');
  }

  return prefix + str + suffix;
}
