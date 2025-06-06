import { TwitterClient } from '../utils/twitterUtils/twitterUtils';

export const postMediaToTwitter = async ({
  caption,
  access_token,
  access_token_secret,
  mediaBuffers,
}: {
  caption: string;
  access_token: string;
  access_token_secret: string;
  mediaBuffers?: Buffer[];
}) => {
  const twitter = new TwitterClient(access_token, access_token_secret);

  if (!mediaBuffers || mediaBuffers.length === 0) {
    await twitter.postTweet(caption); // Text-only tweet
  } else {
    const mediaIds = await twitter.uploadMedia(mediaBuffers); // Upload media
    await twitter.postTweet(caption, mediaIds); // Tweet with media
  }

  return { message: 'Twitter post published successfully' };
};
