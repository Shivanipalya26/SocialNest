import OAuth from 'oauth-1.0a';
import crypto from 'crypto';
import { X_API_KEY, X_API_KEY_SECRET } from '../../config/config';

const oauth = new OAuth({
  consumer: {
    key: X_API_KEY,
    secret: X_API_KEY_SECRET,
  },
  signature_method: 'HMAC-SHA1',
  hash_function(baseString, key) {
    return crypto.createHmac('sha1', key).update(baseString).digest('base64');
  },
});

export const getTwitterOAuthHeader = (
  url: string,
  method: 'POST' | 'GET',
  token: { key: string; secret: string },
  data?: Record<string, string>
) => {
  return oauth.toHeader(oauth.authorize({ url, method, data }, token));
};
