axios.defaults.baseURL = SERVER

window.onload = () => {
  checkSession()
  fetchRecentFiles()
  fetchSharedFiles()
  fetchFileDetails()
}


const checkSession = async () => {
  const session = await getSession()
  console.log(session)
  
  if(!session)
    return location.href = '/login'
  
  document.getElementById('fullname').innerHTML = session?.fullname
  document.getElementById('email').innerHTML = session?.email
}

const getToken = () => {
  const options = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('fileAuthToken')}`
    }
  }
  return options
}

const humanFileSize = (size) =>
  size >= 1e9
    ? (size / 1e9).toFixed(2) + ' GB'
    : size >= 1e6
    ? (size / 1e6).toFixed(2) + ' MB'
    : size >= 1e3
    ? (size / 1e3).toFixed(2) + ' KB'
    : size + ' B';

const fetchRecentFiles = async () => {
  const recentFileBox = document.getElementById('recent-file-box')
  try {
    const {data} = await axios.get('/api/file?page=1&limit=5', getToken())
    console.log(data)
    
    recentFileBox.innerHTML = ""
    data.files.forEach((item) => {
      const fileIcon = getFileIcon(item.extension)
      const ui = `<div class="flex items-center border-b pb-3">
                  <div class="w-10 h-10 flex items-center justify-center bg-${fileIcon.split(" ").pop()}-100 rounded-lg mr-3">
                      <i class="ri-${fileIcon.split(" ")[0]}-line text-${fileIcon.split(" ").pop()}-500"></i>
                  </div>
                  <div class="flex-1">
                      <h4 class="text-sm font-medium text-gray-800">${item.filename}.${item.extension}</h4>
                      <p class="text-xs text-gray-500">${humanFileSize(item.size)} • ${moment(item.createdAt).format('ll')}</p>
                  </div>
                  <div class="flex space-x-2">
                      <button onclick="downloadFile('${item._id}', '${item.filename}', '${item.extension}', this)" class="text-gray-500 hover:text-gray-700">
                          <i class="ri-download-line"></i>
                      </button>
                      <button class="text-gray-500 hover:text-gray-700">
                          <i class="ri-more-2-fill"></i>
                      </button>
                  </div>
              </div>`
      recentFileBox.innerHTML += ui
    })
  } catch (err) {
    console.error(err.response ? err.response.data.message : err.message);
  }
}

const fetchSharedFiles = async () => {
  try {
    const {data} = await axios.get('/api/share', getToken())
    console.log(data)
  } catch (err) {
    console.error(err.response ? err.response.data.message : err.message);
  }
}

const fetchFileDetails = async () => {
  try {
    const numberOfAudio = document.getElementById('number-of-audio')
    const numberOfImage = document.getElementById('number-of-image')
    const numberOfVideo = document.getElementById('number-of-video')
    const numberOfDocument = document.getElementById('number-of-document')
    let usedStorage;
    let totalStorage;
    let freeStorage;
    const {data} = await axios.get('/api/file-details', getToken())

    totalStorage = Number(data.MAX_STORAGE_PER_USER)

    usedStorage = data.file.reduce((acc, x) => acc + x.size, 0)
    freeStorage = totalStorage - usedStorage

    const fileType = ["image", "audio", "video"]
    const noOfFile = {
      image: 0,
      video:0,
      audio: 0,
      document: 0
    }

    data.file.forEach((item) => {
      const type = item.type.split("/")[0]

      switch (type) {
        case "image": noOfFile.image++
          break;
        case "video": noOfFile.video++
          break;
        case "audio": noOfFile.audio++
      
        default: noOfFile.document++
          break;
      }
    })

    numberOfAudio.innerHTML = `Audio: ${noOfFile.audio} files`
    numberOfVideo.innerHTML = `Videos: ${noOfFile.video} files`
    numberOfImage.innerHTML = `Images: ${noOfFile.image} files`
    numberOfDocument.innerHTML = `Documents: ${noOfFile.document} files`

    console.log(noOfFile)

    console.log(freeStorage)
  } catch (err) {
    console.log(err.response ? err.response.data.message : err.message)
  }
}