import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || ''
});

export default cloudinary;

export const uploadBuffer = (buf, mimeType = 'image/jpeg') =>
  new Promise((resolve, reject) => {
    // If Cloudinary keys are configured and not demo, try uploading to Cloudinary
    const isCloudinaryConfigured =
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_CLOUD_NAME !== 'demo' &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_KEY !== '123456789012345';

    if (isCloudinaryConfigured) {
      cloudinary.uploader
        .upload_stream(
          {
            folder: 'mua',
            transformation: [{ width: 2000, crop: 'limit', quality: 'auto', fetch_format: 'auto' }]
          },
          (err, result) => {
            if (err) {
              console.warn('[Cloudinary] Upload failed, falling back to local data URL:', err.message);
              // Fallback to base64 data URL so request doesn't fail
              const base64 = buf.toString('base64');
              const url = `data:${mimeType};base64,${base64}`;
              resolve({ secure_url: url, public_id: `local_${Date.now()}_${Math.random().toString(36).substring(7)}` });
            } else {
              resolve(result);
            }
          }
        )
        .end(buf);
    } else {
      // In dev mode without live Cloudinary keys, use data URI
      const base64 = buf.toString('base64');
      const url = `data:${mimeType};base64,${base64}`;
      resolve({
        secure_url: url,
        public_id: `dev_${Date.now()}_${Math.random().toString(36).substring(7)}`
      });
    }
  });

export const deleteCloudinaryImage = async (publicId) => {
  if (!publicId || publicId.startsWith('dev_') || publicId.startsWith('local_')) {
    return { result: 'ok' };
  }
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.warn('[Cloudinary] Failed to delete image:', err.message);
    return { result: 'error', error: err.message };
  }
};
