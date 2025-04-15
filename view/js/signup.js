axios.defaults.baseURL = SERVER

window.onload = () => {
  checkSession()
}

const checkSession = async () => {
  const session = await getSession()
  if(session){
    location.href = '/dashboard'
  }
}

const signup = async (e) => {
  try {
    e.preventDefault()
    const form = e.target
    const element = form.elements
    const payload = {
      fullname: element.fullname?.value || "",
      mobile: element.mobile?.value || "",
      email: element.email?.value || "",
      password: element.password?.value || ""
    }

    const {data} = await axios.post('/api/signup', payload)
    form.reset()
    toast.success(data.message)

    setTimeout(() => {
      window.location.href = '/login'
    }, 3000)

  } catch (error) {
    toast.error(error.response ? error.response.data.message : error.message)
  }
}