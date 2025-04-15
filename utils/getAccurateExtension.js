const mime = require('mime-types');
const path = require('path'); // This was missing

// Comprehensive mapping of MIME types to extensions
const customMimeMap = {
  // Executable files
  'application/x-msdownload': 'exe',
  'application/exe': 'exe',
  'application/x-exe': 'exe',
  'application/dos-exe': 'exe',
  'vms/exe': 'exe',
  'application/x-winexe': 'exe',
  'application/msdos-windows': 'exe',
  
  // Installation files
  'application/x-msi': 'msi',
  'application/msi': 'msi',
  
  // Office documents
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
  'application/msword': 'doc',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.ms-powerpoint': 'ppt',
  'application/vnd.oasis.opendocument.text': 'odt',
  'application/vnd.oasis.opendocument.spreadsheet': 'ods',
  'application/vnd.oasis.opendocument.presentation': 'odp',
  
  // Archive files
  'application/x-rar-compressed': 'rar',
  'application/rar': 'rar',
  'application/x-7z-compressed': '7z',
  'application/7z': '7z',
  'application/zip': 'zip',
  'application/x-zip-compressed': 'zip',
  'application/gzip': 'gz',
  'application/x-gzip': 'gz',
  'application/x-tar': 'tar',
  'application/x-bzip2': 'bz2',
  'application/x-bzip': 'bz',
  
  // PDF files
  'application/pdf': 'pdf',
  
  // Image files
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
  'image/bmp': 'bmp',
  'image/tiff': 'tiff',
  
  // Audio files
  'audio/mpeg': 'mp3',
  'audio/ogg': 'ogg',
  'audio/wav': 'wav',
  'audio/webm': 'webm',
  'audio/aac': 'aac',
  'audio/flac': 'flac',
  
  // Video files
  'video/mp4': 'mp4',
  'video/mpeg': 'mpeg',
  'video/webm': 'webm',
  'video/x-msvideo': 'avi',
  'video/quicktime': 'mov',
  'video/x-matroska': 'mkv',
  
  // Text files
  'text/plain': 'txt',
  'text/html': 'html',
  'text/css': 'css',
  'text/csv': 'csv',
  
  // Programming files
  'application/javascript': 'js',
  'text/javascript': 'js',
  'application/json': 'json',
  'application/xml': 'xml',
  'text/xml': 'xml',
  
  // Shell scripts
  'application/x-sh': 'sh',
  'application/x-bat': 'bat',
  'application/x-powershell': 'ps1',
  
  // Special case for application/octet-stream
  'application/octet-stream': null // Will rely on file extension detection
};

// Common file extensions lookup for binary files
const commonExtensions = [
  'exe', 'msi', 'dll', 'bin', 'dat', 'dmg', 
  'iso', 'img', 'apk', 'app', 'jar',
  'docx', 'xlsx', 'pptx', 'pdf', 'doc', 'xls', 'ppt',
  'zip', 'rar', '7z', 'tar', 'gz', 'bz2',
  'mp3', 'wav', 'mp4', 'mov', 'avi', 'mkv',
  'jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'
];

/**
 * Get accurate file extension from MIME type and original filename
 * 
 * @param {string} mimetype - The MIME type of the file
 * @param {string} originalFilename - The original filename with extension
 * @return {string} The file extension without the dot
 */
function getAccurateExtension(mimetype = '', originalFilename = '') {
  // First try: get extension from original filename if available
  if (originalFilename && originalFilename.trim() !== '') {
    const fileExt = path.extname(originalFilename).toLowerCase().replace('.', '');
    if (fileExt) {
      // Validate the extension is reasonable
      if (fileExt.length <= 10) { // Safety check for malicious inputs
        return fileExt;
      }
    }
  }
  
  // Second try: check our custom map for this MIME type
  if (mimetype && customMimeMap[mimetype] !== undefined) {
    // If mapping exists but is null, continue to next method
    if (customMimeMap[mimetype] !== null) {
      return customMimeMap[mimetype];
    }
  }
  
  // Third try: use the mime-types library
  if (mimetype) {
    const mimeExtension = mime.extension(mimetype);
    if (mimeExtension) {
      return mimeExtension;
    }
  }
  
  // Special handling for octet-stream: try to detect common binary formats
  if (mimetype === 'application/octet-stream' && originalFilename) {
    const fileExt = path.extname(originalFilename).toLowerCase().replace('.', '');
    if (commonExtensions.includes(fileExt)) {
      return fileExt;
    }
  }
  
  // Last resort: default to 'bin' for unknown binary types
  return 'bin';
}

module.exports = {
  getAccurateExtension
};