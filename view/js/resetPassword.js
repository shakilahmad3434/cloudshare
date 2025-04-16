axios.defaults.baseURL = SERVER

const resetPassword = async (e) => {
  e.preventDefault()
  const urlParams = new URLSearchParams(window.location.search)
  const token = urlParams.get('token')

  try {
    const form = e.target
    const password = form.elements.password?.value || ""
    const rePassword = form.elements.repassword?.value || ""
    if(password !== rePassword){
      console.log("Password didn't match!")
      return 
    }

    const options = { password, token }
    const {data} = await axios.post('/api/reset-password', options)

    console.log(data)

  } catch (err) {
    console.log(err.response ? err.response.data.message : err.message)
  }
}