axios.defaults.baseURL = SERVER
window.onload = () => {
  checkSession(),
  fetchShared()
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

const fetchShared = async () => {
  try {
    const {data} = await axios.get('/api/share', getToken())

    data.forEach((data) => {
      console.log(data)
    })
   
  } catch (err) {
    toast.error(err.response ? err.response.data.message : err.message)
  }
}