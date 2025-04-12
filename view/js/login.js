axios.defaults.baseURL = SERVER

const checkSession = async () => {
  const session = await getSession()
  
  if(session){
    location.href = '/dashboard'
  }
}

checkSession()

const login = async (e) => {
  try {
    e.preventDefault()
    const form = e.target
    const element = form.elements
    const payload = {
      email: element.email?.value || "",
      password: element.password?.value || ""
    }

    const {data} = await axios.post('/api/login', payload)
    localStorage.setItem('fileAuthToken', data.token)
    toast.success(data.message)

    setTimeout(() => {
      location.href = '/dashboard'
    }, 3000)

  } catch (err) {
    toast.error(err.response ? err.response.data.message : err.message)
  }
}