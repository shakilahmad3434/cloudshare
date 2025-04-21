axios.defaults.baseURL = SERVER

const checkSession = async () => {
  const session = await getSession()
  
  if(session){
    location.href = '/dashboard'
  }
}

checkSession()

const login = async (e) => {
  e.preventDefault()
  const loginBtn = document.getElementById('login-btn')
  try {
    const form = e.target
    const element = form.elements
    const remember = element.remember?.checked

    const payload = {
      email: element.email?.value || "",
      password: element.password?.value || ""
    }

    loginBtn.innerHTML = `<i class="ri-loader-4-line mr-1 animate-spin"></i> Processing...`
    loginBtn.disabled = true

    const {data} = await axios.post('/api/login', payload)

    if(!remember)
    {
      sessionStorage.setItem('fileAuthToken', data.token)
    }
    else
    {
      sessionStorage.setItem('fileAuthToken', data.token)
      localStorage.setItem('fileAuthToken', data.token)
    }
    
    form.reset()
    toast.success('Success', data.message)

    setTimeout(() => {
      location.href = '/dashboard'
    }, 2000)

  } catch (err) {
    toast.error('Error', err.response ? err.response.data.message : err.message)
  } finally {
    loginBtn.innerHTML = `Sign in <i class="ri-arrow-right-line ml-1"></i>`
    loginBtn.disabled = false
  }
}