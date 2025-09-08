const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Handle path encoding issues
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Add support for additional file types
config.resolver.assetExts.push(
  // Fonts
  'ttf',
  'otf',
  'woff',
  'woff2',
  // Images
  'svg',
  // Audio
  'mp3',
  'wav',
  'aac',
  // Video
  'mp4',
  'mov',
  // Documents
  'pdf',
  // Lottie
  'json'
);

// Ensure proper handling of source maps
config.resolver.sourceExts.push('jsx', 'js', 'ts', 'tsx', 'json');

module.exports = config;
