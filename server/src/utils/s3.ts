import { S3Client, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

export const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const getFromS3Bucket = async (key: string) => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
  });

  try {
    const response = await s3Client.send(command);
    const body = await response.Body?.transformToByteArray();
    if (!body) {
      throw new Error('File not found in S3');
    }
    return Buffer.from(body);
  } catch (error) {
    console.error('Error retrieving file from S3: ', error);
    throw new Error('Error retrieving file from S3');
  }
};

export const deleteFromS3Bucket = async (key: string) => {
  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
  });
  console.log('key,', key, command);

  try {
    await s3Client.send(command);
    console.log(`File deleted successfully from S3 ${key}`);
  } catch (error) {
    console.error('Error deleting file from S3:', error);
    throw new Error('Error deleting file from S3');
  }
};
