import { Response } from 'express';
import { deleteFromS3Bucket } from '../utils/s3';
import { AuthRequest } from '../types';

export const deleteMedia = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.userId;

  if (!userId) {
    res.status(400).json({ error: 'Missing userId' });
    return;
  }
  const { mediaKey } = req.body;

  if (!mediaKey) {
    res.status(400).json({ error: 'Missing key in request body' });
    return;
  }

  try {
    await deleteFromS3Bucket(mediaKey);
    res.status(200).json({ message: 'Media deleted successfully' });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to delete media' });
    return;
  }
};
