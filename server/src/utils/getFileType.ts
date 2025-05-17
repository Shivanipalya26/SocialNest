import fileType from 'file-type';

export const getFileType = async (buffer: Buffer): Promise<string> => {
  const type = await fileType.fromBuffer(buffer);
  console.log('type: ', type);
  console.log('type: ', type?.mime);
  return type?.mime || 'application/octet-stream';
};
