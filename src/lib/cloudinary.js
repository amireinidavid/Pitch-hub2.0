import { v2 as cloudinary } from "cloudinary";

// Validate required environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME',
  'NEXT_PUBLIC_CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET'
];

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});

// Configure cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Enable HTTPS
});

// Export configured instance
export default cloudinary;

// Export common upload presets
export const UPLOAD_PRESETS = {
  PITCH_IMAGES: 'pitches/images',
  PITCH_VIDEOS: 'pitches/videos',
  PITCH_DOCUMENTS: 'pitches/documents',
  PITCH_SLIDES: 'pitches/slides'
};

// Export common upload options
export const getUploadOptions = (preset) => ({
  folder: preset,
  resource_type: preset.includes('videos') ? 'video' : 'auto',
  allowed_formats: preset.includes('documents') 
    ? ['pdf', 'doc', 'docx', 'ppt', 'pptx'] 
    : preset.includes('videos')
    ? ['mp4', 'mov', 'avi']
    : ['jpg', 'jpeg', 'png', 'gif'],
  transformation: preset.includes('images') ? [
    { quality: 'auto:good' },
    { fetch_format: 'auto' }
  ] : undefined
});
