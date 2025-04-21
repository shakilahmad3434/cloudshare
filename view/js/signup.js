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
  e.preventDefault()
  const signupBtn = document.getElementById('signup-btn')
  try {
    const form = e.target
    const element = form.elements
    const payload = {
      fullname: element.fullname?.value || "",
      mobile: element.mobile?.value || "",
      email: element.email?.value || "",
      password: element.password?.value || ""
    }

    signupBtn.innerHTML = `<i class="ri-loader-4-line mr-1 animate-spin"></i> Processing...`
    signupBtn.disabled = true

    const {data} = await axios.post('/api/signup', payload)
    form.reset()
    toast.success('Success', data.message)

    setTimeout(() => {
      window.location.href = '/login'
    }, 3000)

  } catch (error) {
    toast.error('Error', error.response ? error.response.data.message : error.message)
  } finally {
    signupBtn.innerHTML = `Create Account <i class="ri-arrow-right-line ml-2"></i>`
    signupBtn.disabled = false
  }
}