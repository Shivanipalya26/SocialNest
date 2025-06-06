import axios from 'axios';
import FormData from 'form-data';
import { getTwitterOAuthHeader } from './twitterOAuth';
import { getFileType } from '../getFileType';

export class TwitterClient {
  constructor(
    private accessToken: string,
    private accessTokenSecret: string
  ) {}

  private getOAuthHeader(url: string, method: 'POST' | 'GET', data?: Record<string, string>) {
    return getTwitterOAuthHeader(
      url,
      method,
      {
        key: this.accessToken,
        secret: this.accessTokenSecret,
      },
      data
    );
  }

  async postTweet(text: string, mediaIds?: string[]) {
    const url = 'https://api.twitter.com/2/tweets';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = { text };
    if (mediaIds?.length) {
      payload.media = { media_ids: mediaIds };
    }

    const headers = this.getOAuthHeader(url, 'POST');
    const res = await axios.post(url, payload, {
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
    });

    return res.data;
  }

  async uploadMedia(buffers: Buffer[]): Promise<string[]> {
    const mediaIds: string[] = [];

    // const mediaTypes = await Promise.all(
    //   buffers.map((b) => getTwitterFileType(b))
    // );

    for (let i = 0; i < buffers.length; i++) {
      const buffer = buffers[i];
      // const mediaType = mediaTypes[i];
      const contentType = await getFileType(buffer);

      const mediaId =
        buffer.length <= 5 * 1024 * 1024
          ? await this.uploadSimple(buffer)
          : await this.uploadChunked(buffer, contentType);

      mediaIds.push(mediaId);
    }

    return mediaIds;
  }

  async getTwitterUserDetails() {
    const url = 'https://api.twitter.com/1.1/account/verify_credentials.json';

    const headers = this.getOAuthHeader(url, 'GET');
    const res = await axios.get(url, {
      headers: { ...headers },
    });
    // console.log('Twitter user details fetched successfully');
    return res.data;
  }

  private async uploadSimple(buffer: Buffer): Promise<string> {
    const url = 'https://upload.twitter.com/1.1/media/upload.json';
    const data = { media_data: buffer.toString('base64') };

    const headers = this.getOAuthHeader(url, 'POST', data);

    const res = await axios.post(url, new URLSearchParams(data), {
      headers: {
        ...headers,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return res.data.media_id_string;
  }

  private async uploadChunked(buffer: Buffer, contentType: string): Promise<string> {
    const url = 'https://upload.twitter.com/1.1/media/upload.json';

    const initData = {
      command: 'INIT',
      total_bytes: buffer.length.toString(),
      media_type: contentType,
    };

    const initHeaders = this.getOAuthHeader(url, 'POST', initData);
    const initRes = await axios.post(url, new URLSearchParams(initData), {
      headers: {
        ...initHeaders,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const mediaId = initRes.data.media_id_string;
    const chunkSize = 5 * 1024 * 1024;

    for (let i = 0; i < buffer.length; i += chunkSize) {
      const chunk = buffer.slice(i, i + chunkSize);
      const form = new FormData();
      form.append('command', 'APPEND');
      form.append('media_id', mediaId);
      form.append('segment_index', String(i / chunkSize));
      form.append('media', chunk, {
        filename: 'chunk.mp4',
        contentType,
      });

      const headers = this.getOAuthHeader(url, 'POST');

      await axios.post(url, form, {
        headers: {
          ...headers,
          ...form.getHeaders(),
        },
      });
    }

    const finalizeData = {
      command: 'FINALIZE',
      media_id: mediaId,
    };

    const finalizeHeaders = this.getOAuthHeader(url, 'POST', finalizeData);

    const finalizeRes = await axios.post(url, new URLSearchParams(finalizeData), {
      headers: {
        ...finalizeHeaders,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (finalizeRes.data.processing_info) {
      await this.waitForProcessing(mediaId);
    }

    return mediaId;
  }

  private async waitForProcessing(mediaId: string): Promise<void> {
    const url = 'https://upload.twitter.com/1.1/media/upload.json';
    while (true) {
      const params = {
        command: 'STATUS',
        media_id: mediaId,
      };

      const headers = this.getOAuthHeader(url, 'GET', params);

      const res = await axios.get(url, {
        params,
        headers: {
          ...headers,
        },
      });

      const info = res.data.processing_info;
      if (!info || info.state === 'succeeded') break;
      if (info.state === 'failed') throw new Error('Media processing failed');

      await new Promise(r => setTimeout(r, (info.check_after_secs || 1) * 1000));
    }
  }
}
