import axios from 'axios';
import { getTwitterOAuthHeader } from './twitterOAuth';
import FormData from 'form-data';

export const uploadMediaSimple = async (
  buffer: Buffer,
  accessToken: string,
  accessTokenSecret: string
): Promise<string> => {
  const url = 'https://upload.twitter.com/1.1/media/upload.json';
  const data = { media_data: buffer.toString('base64') };

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
  console.log('Uploaded Media: ', response.data);
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
  console.log('init headers:', initHeaders);

  const initRes = await axios.post(initUrl, new URLSearchParams(initData), {
    headers: {
      ...initHeaders,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  console.log('init Resp:', initRes);

  const mediaId = initRes.data.media_id_string;

  const chunkSize = 5 * 1024 * 1024;
  for (let i = 0; i < buffer.length; i += chunkSize) {
    const chunk = buffer.slice(i, i + chunkSize);
    console.log('chunk: ', chunk);

    const form = new FormData();
    form.append('command', 'APPEND');
    form.append('media_id', mediaId);
    form.append('segment_index', String(i / chunkSize));
    form.append('media', chunk, {
      filename: 'chunk.mp4',
      contentType: contentType,
    });

    console.log('append data: ', form);

    const appendHeaders = getTwitterOAuthHeader(initUrl, 'POST', {
      key: accessToken,
      secret: accessTokenSecret,
    });

    console.log('append headers', appendHeaders);

    const response = await axios.post(initUrl, form, {
      headers: {
        ...appendHeaders,
        ...form.getHeaders(),
      },
    });
    console.log('append response: ', response);
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

  console.log('finalise: ', finalizeHeaders);

  const finalizeRes = await axios.post(initUrl, new URLSearchParams(finalizeData), {
    headers: {
      ...finalizeHeaders,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  console.log('finalize response: ', finalizeRes);

  if (finalizeRes.data.processing_info) {
    await waitForProcessingCompletion(mediaId, accessToken, accessTokenSecret);
  }

  return mediaId;
};

const waitForProcessingCompletion = async (
  mediaId: string,
  accessToken: string,
  accessTokenSecret: string
): Promise<void> => {
  const statusUrl = 'https://upload.twitter.com/1.1/media/upload.json';
  const token = {
    key: accessToken,
    secret: accessTokenSecret,
  };

  while (true) {
    const params = {
      command: 'STATUS',
      media_id: mediaId,
    };

    const statusHeaders = getTwitterOAuthHeader(statusUrl, 'GET', token, params);

    const response = await axios.get(statusUrl, {
      params,
      headers: {
        ...statusHeaders,
      },
    });

    const processingInfo = response.data.processing_info;
    if (!processingInfo || processingInfo.state === 'succeeded') {
      console.log('Media processing complete');
      break;
    }

    if (processingInfo.state === 'failed') {
      throw new Error('Media processing failed');
    }

    const waitTime = processingInfo.check_after_secs || 1;
    console.log(`Waiting ${waitTime} seconds before next status check...`);
    await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
  }
};
