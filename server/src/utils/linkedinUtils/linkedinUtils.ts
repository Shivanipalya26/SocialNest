import axios from 'axios';
import { getFileType } from '../getFileType';

export class LinkedinUtils {
  private readonly linkedinApi = 'https://api.linkedin.com/v2';
  private readonly access_token: string;
  private readonly personURN: string;
  private readonly chunkSize = 5 * 1024 * 1024;

  constructor(access_token: string, personURN: string) {
    this.access_token = access_token;
    this.personURN = personURN;
  }

  private async getMediaFileType(media: Buffer): Promise<'feedshare-image' | 'feedshare-video'> {
    const fileType = await getFileType(media);
    if (!fileType) throw new Error('File type not found');

    return fileType.startsWith('image/') ? 'feedshare-image' : 'feedshare-video';
  }

  private isLarge(fileSize: number): boolean {
    return fileSize > 100 * 1024 * 1024;
  }

  async registerUpload(buffer: Buffer) {
    const fileType = await this.getMediaFileType(buffer);

    const res = await axios.post(
      `${this.linkedinApi}/assets?action=registerUpload`,
      {
        registerUploadRequest: {
          recipes: [`urn:li:digitalmediaRecipe:${fileType}`],
          owner: this.personURN,
          serviceRelationships: [
            {
              relationshipType: 'OWNER',
              identifier: 'urn:li:userGeneratedContent',
            },
          ],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${this.access_token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const uploadUrl =
      res.data.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest']
        .uploadUrl;
    const assetURN = res.data.value.asset;
    return { uploadUrl, assetURN };
  }

  async uploadSmall(uploadUrl: string, buffer: Buffer) {
    await axios.put(uploadUrl, buffer, {
      headers: {
        Authorization: `Bearer ${this.access_token}`,
        'Content-Type': await getFileType(buffer),
      },
    });
  }

  async uploadLarge(uploadUrl: string, buffer: Buffer) {
    for (let begin = 0; begin < buffer.length; begin += this.chunkSize) {
      const end = Math.min(begin + this.chunkSize, buffer.length) - 1;
      const chunk = buffer.slice(begin, end + 1);
      const contentRange = `bytes ${begin}-${end}/${buffer.length}`;
      await axios.put(uploadUrl, chunk, {
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Range': contentRange,
        },
      });
    }
  }

  async checkStatus(assetURN: string) {
    const assetId = assetURN.split(':').pop();
    for (let attempt = 1; attempt <= 10; attempt++) {
      const res = await axios.get(`${this.linkedinApi}/assets/${assetId}`, {
        headers: {
          Authorization: `Bearer ${this.access_token}`,
        },
      });

      if (res.data.status === 'ALLOWED') return;
      await new Promise(res => setTimeout(res, 3600));
    }
    throw new Error('Linkedin media processing timed out');
  }

  async uploadMedia(buffer: Buffer) {
    const fileSize = buffer.length;
    const { uploadUrl, assetURN } = await this.registerUpload(buffer);

    if (this.isLarge(fileSize)) {
      await this.uploadLarge(uploadUrl, buffer);
      await this.checkStatus(assetURN);
    } else {
      await this.uploadSmall(uploadUrl, buffer);
    }
    return assetURN;
  }

  public async postText(text: string) {
    const body = {
      author: this.personURN,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: { text },
          shareMediaCategory: 'NONE',
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
      },
    };

    await axios.post(`${this.linkedinApi}/ugcPosts`, body, {
      headers: {
        Authorization: `Bearer ${this.access_token}`,
        'Content-Type': 'application/json',
      },
    });
  }

  public async postMedia(buffers: Buffer[], caption: string) {
    const assetURNs: string[] = [];
    const mimeTypes: string[] = [];

    for (const buffer of buffers) {
      const mimeType = await getFileType(buffer);
      if (!mimeType) {
        throw new Error('Invalid file type');
      }
      mimeTypes.push(mimeType);

      const assetURN = await this.uploadMedia(buffer);
      assetURNs.push(assetURN);
    }

    const mediaType = mimeTypes.every(m => m.startsWith('image/')) ? 'IMAGE' : 'VIDEO';
    const media = assetURNs.map((asset, index) => ({
      status: 'READY',
      media: asset,
      title: { text: `Media (${mimeTypes[index]})` },
    }));

    const payload = {
      author: this.personURN,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: { text: caption },
          shareMediaCategory: mediaType,
          media,
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
      },
    };

    await axios.post(`${this.linkedinApi}/ugcPosts`, payload, {
      headers: {
        Authorization: `Bearer ${this.access_token}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('LinkedIn post with media published successfully');
  }
}
