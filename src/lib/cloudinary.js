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
  PITCH_SLIDES: 'pitches/slides',
  PITCH_AUDIO: 'pitches/audio'
};

// Export common upload options
export const getUploadOptions = (preset) => ({
  folder: preset,
  resource_type: getResourceType(preset),
  allowed_formats: getAllowedFormats(preset),
  transformation: getTransformation(preset)
});

// Helper function to determine resource type
function getResourceType(preset) {
  if (preset.includes('videos')) return 'video';
  if (preset.includes('audio')) return 'video'; // Cloudinary uses 'video' for audio too
  if (preset.includes('images') || preset.includes('slides')) return 'image';
  return 'auto';
}

// Helper function to get allowed formats
function getAllowedFormats(preset) {
  if (preset.includes('documents')) {
    return ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'txt', 'rtf', 'csv', 'xls', 'xlsx'];
  }
  if (preset.includes('videos')) {
    return ['mp4', 'mov', 'avi', 'wmv', 'flv', 'mkv', 'webm'];
  }
  if (preset.includes('audio')) {
    return ['mp3', 'wav', 'ogg', 'm4a', 'aac'];
  }
  if (preset.includes('images') || preset.includes('slides')) {
    return [
      'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 
      'tiff', 'svg', 'heic', 'heif', 'raw'
    ];
  }
  // For auto/unknown types, return null to accept all formats
  return null;
}

// Helper function to get transformations
function getTransformation(preset) {
  if (preset.includes('images') || preset.includes('slides')) {
    return [
      { quality: 'auto:good' },
      { fetch_format: 'auto' }
    ];
  }
  if (preset.includes('videos')) {
    return [
      { quality: 'auto:good' },
      { fetch_format: 'auto' }
    ];
  }
  return undefined;
}
