function getFileIcon(ext) {
  const iconMap = {
    // Documents
    doc: 'file-word blue',
    docx: 'file-word blue',
    pdf: 'file-pdf red',
    txt: 'file-text gray',
    xls: 'file-excel green',
    xlsx: 'file-excel green',
    ppt: 'file-ppt orange',
    pptx: 'file-ppt orange',

    // Images
    jpg: 'image indigo',
    jpeg: 'image indigo',
    png: 'image indigo',
    gif: 'image pink',
    svg: 'image purple',
    webp: 'image sky',

    // Audio
    mp3: 'music pink',
    wav: 'music rose',
    ogg: 'music rose',

    // Video
    mp4: 'film purple',
    avi: 'film purple',
    mov: 'film purple',
    mkv: 'film purple',

    // Archives
    zip: 'file-zip emerald',
    rar: 'file-zip emerald',
    tar: 'file-zip teal',
    gz: 'file-zip teal',

    // Code
    js: 'code yellow',
    jsx: 'code yellow',
    ts: 'code blue',
    tsx: 'code blue',
    html: 'code orange',
    css: 'code cyan',
    json: 'braces gray',
    xml: 'braces gray',
    php: 'code indigo',

    // Executables
    exe: 'file-settings rose',
    msi: 'file-settings rose',
    apk: 'file-settings green',

    // Fonts
    ttf: 'font-size gray',
    otf: 'font-size gray',
    woff: 'font-size gray',

    // Other
    csv: 'file-list blue',
    md: 'file-text slate',
    log: 'file-text slate',
  };

  return iconMap[ext.toLowerCase()] || 'file emerald';
}


function getActivityIcon(ext){
  const iconMap = {
    upload: 'upload-cloud-2-line blue',
    rename: 'edit-box-line green',
    share: 'share-fill purple',
    delete: 'delete-bin-6-line red',
    download: 'download-cloud-line yellow',
    'shared-download': 'mail-download-line emerald'
  }

  return iconMap[ext.toLowerCase()] || 'file emerald'
}