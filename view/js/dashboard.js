axios.defaults.baseURL = SERVER

window.onload = () => {
  checkSession()
  fetchRecentFiles()
  fetchSharedFiles()
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

// async function dashboard(){
//   try {
//     const response = await axios.get('/api/dashboard', getToken())
//     console.log(response)
//     const dataMap = {
//       video: 'video',
//       audio: 'audio',
//       image: 'image',
//       pdf: 'pdf'
//     }

//     response.data.forEach(({type, total}) => {
//       const element = document.getElementById(dataMap[type])
//         if(element){
//           element.innerHTML = total
//         }
//     })

//   } catch (err) {
//     console.error(err.response ? err.response.data.message : err.message);
//   }
// }

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
                      <button class="text-gray-500 hover:text-gray-700">
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