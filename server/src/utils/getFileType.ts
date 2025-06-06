import fileType from 'file-type';

export const getFileType = async (buffer: Buffer): Promise<string> => {
  const type = await fileType.fromBuffer(buffer);
  console.log('type: ', type);
  console.log('type: ', type?.mime);
  return type?.mime || 'application/octet-stream';
};

export enum TwiiterFileType {
  TWEET_IMAGE = 'tweet_image',
  TWEET_GIF = 'tweet_gif',
  TWEET_VIDEO = 'tweet_video',
}

export async function getTwitterFileType(buffer: Buffer): Promise<TwiiterFileType> {
  const type = await fileType.fromBuffer(buffer);

  if (!type) {
    throw new Error('File type not found');
  }

  const mime = type.mime;

  if (mime.startsWith('image/')) {
    if (mime === 'image/gif') {
      return TwiiterFileType.TWEET_GIF;
    }
    return TwiiterFileType.TWEET_IMAGE;
  }

  if (mime.startsWith('video/')) {
    return TwiiterFileType.TWEET_VIDEO;
  }

  throw new Error('Invalid file type ' + mime);
}
