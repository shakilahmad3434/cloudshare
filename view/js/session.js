axios.defaults.baseURL = SERVER

const getSession = async () => {
  try {
    const session = localStorage.getItem('fileAuthToken') || sessionStorage.getItem('fileAuthToken')
    
    if(!session)
      return null

    const payload = {
      token: session
  }

    const {data} = await axios.post('/api/token/verify', payload)
    return data

  } catch (error) {
    return null
  }
};

getSession()

