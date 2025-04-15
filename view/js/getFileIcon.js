function getFileIcon(ext) {
  const iconMap = {
    docx: 'file-text yellow',
    pdf: 'file-pdf red',
    jpg: 'image blue',
    png: 'image blue',
    mp4: 'file-video indigo',
    exe: 'file-settings rose',
    msi: 'file-settings rose',
    zip: 'file-zip emerald',
  };
  return iconMap[ext.toLowerCase()] || 'file emerald';
}
