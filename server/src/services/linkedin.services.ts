import { LinkedinUtils } from '../utils/linkedinUtils/linkedinUtils';

export const postMediaToLinkedIn = async ({
  caption,
  access_token,
  personURN,
  mediaBuffers,
}: {
  caption: string;
  access_token: string;
  personURN: string;
  mediaBuffers: Buffer[];
}) => {
  const linkedin = new LinkedinUtils(access_token, `urn:li:person:${personURN}`);
  if (!mediaBuffers || mediaBuffers.length === 0) {
    await linkedin.postText(caption);
  } else {
    await linkedin.postMedia(mediaBuffers, caption);
  }
  return { message: 'LinkedIn post published successfully' };
};
