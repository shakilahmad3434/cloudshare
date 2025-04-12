axios.defaults.baseURL = SERVER

const checkSession = async () => {
  const session = await getSession()
  
  if(!session)
    return location.href = '/login'
}

checkSession()

async function dashboard(){
  try {
    const response = await axios.get('/api/dashboard')

    const dataMap = {
      video: 'video',
      audio: 'audio',
      image: 'image',
      pdf: 'pdf'
    }

    response.data.forEach(({type, total}) => {
      const element = document.getElementById(dataMap[type])
        if(element){
          element.innerHTML = total
        }
    })

  } catch (err) {
    console.error(err.response ? err.response.data.message : err.message);
  }
}

dashboard()