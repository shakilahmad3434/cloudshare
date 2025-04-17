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

function getActivityIcon(ext){
  const iconMap = {
    upload: 'upload-cloud-2-line blue',
    rename: 'edit-box-line green',
    share: 'share-fill purple',
    delete: 'delete-bin-6-line red',
    download: 'download-cloud-line yellow'
  }

  return iconMap[ext.toLowerCase()] || 'file emerald'
}