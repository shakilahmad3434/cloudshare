axios.defaults.baseURL = SERVER

window.onload = () => {
  checkSession()
  fetchRecentFiles()
  fetchSharedFiles()
}

const checkSession = async () => {
  const session = await getSession()
  
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
  try {
    const {data} = await axios.get('/api/file', getToken())
    console.log(data)
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