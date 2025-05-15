import axios from 'axios';
import { getTwitterOAuthHeader } from './twitterOAuth';

export const uploadMediaSimple = async (
  buffer: Buffer,
  accessToken: string,
  accessTokenSecret: string
): Promise<string> => {
  const url = 'https://upload.twitter.com/1.1/media/upload.json';
  const data = { media: buffer.toString('base64') };

  const headers = getTwitterOAuthHeader(
    url,
    'POST',
    { key: accessToken, secret: accessTokenSecret },
    data
  );

  const response = await axios.post(url, new URLSearchParams(data), {
    headers: {
      ...headers,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return response.data.media_id_string;
};

export const uploadMediaChunked = async (
  buffer: Buffer,
  contentType: string,
  accessToken: string,
  accessTokenSecret: string
): Promise<string> => {
  const totalBytes = buffer.length;
  const initUrl = 'https://upload.twitter.com/1.1/media/upload.json';
  const initData = {
    command: 'INIT',
    total_bytes: totalBytes.toString(),
    media_type: contentType,
  };

  const initHeaders = getTwitterOAuthHeader(
    initUrl,
    'POST',
    { key: accessToken, secret: accessTokenSecret },
    initData
  );

  const initRes = await axios.post(initUrl, new URLSearchParams(initData), {
    headers: {
      ...initHeaders,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  const mediaId = initRes.data.media_id_string;

  const chunkSize = 5 * 1024 * 1024;
  for (let i = 0; i < buffer.length; i += chunkSize) {
    const chunk = buffer.slice(i, i + chunkSize);

    const appendData = new URLSearchParams();
    appendData.append('command', 'APPEND');
    appendData.append('media_id', mediaId);
    appendData.append('segmend_index', String(i / chunkSize));
    appendData.append('media', chunk.toString('base64'));

    const appendHeaders = getTwitterOAuthHeader(initUrl, 'POST', {
      key: accessToken,
      secret: accessTokenSecret,
    });

    await axios.post(initUrl, appendData, {
      headers: {
        ...appendHeaders,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }

  const finalizeData = {
    command: 'FINALIZE',
    media_id: mediaId,
  };

  const finalizeHeaders = getTwitterOAuthHeader(
    initUrl,
    'POST',
    { key: accessToken, secret: accessTokenSecret },
    finalizeData
  );

  await axios.post(initUrl, new URLSearchParams(finalizeData), {
    headers: {
      ...finalizeHeaders,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return mediaId;
};
