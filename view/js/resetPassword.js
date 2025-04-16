axios.defaults.baseURL = SERVER

const resetPassword = async (e) => {
  e.preventDefault()
  const urlParams = new URLSearchParams(window.location.search)
  const token = urlParams.get('token')
  const successMessage = document.getElementById('success-message')
  const errorMessage = document.getElementById('error-message')
  const submitBtn = document.getElementById('submit-btn')

  try {
    const form = e.target
    const password = form.elements.password?.value || ""
    const rePassword = form.elements.repassword?.value || ""
    if(password !== rePassword){
      errorMessage.parentElement.classList.remove('hidden')
      errorMessage.innerHTML = "Password didn't Match!"
      return 
    }

    submitBtn.disabled = true
    submitBtn.innerHTML = `<i class="ri-loader-line animate-spin ml-1"></i> Processing...`

    const options = { password, token }
    const {data} = await axios.post('/api/reset-password', options)

    successMessage.parentElement.classList.remove('hidden')
    successMessage.innerHTML = data.message

    form.reset()

    setTimeout(() => {
      window.location.href = "/login"
    }, 1000)

  } catch (err) {
    console.log(err.response ? err.response.data.message : err.message)
    errorMessage.parentElement.classList.remove('hidden')
    errorMessage.innerHTML = err.response ? err.response.data.message : err.message
  } finally {
    submitBtn.disabled = false
    submitBtn.innerHTML = `Reset Password <i class="ri-arrow-right-line ml-1"></i>`

    setTimeout(() => {
      errorMessage.parentElement.classList.add('hidden')
      successMessage.parentElement.classList.add('hidden')
    }, 2000)
  }
}