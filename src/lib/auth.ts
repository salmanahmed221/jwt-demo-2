export function getJWTsecretKey() {
  const secret = process.env.JWT_SECRET_TOKEN;
  if (!secret || secret.length === 0) {
    throw new Error('JWT secret is not set in env');
  }
  return secret;
}
