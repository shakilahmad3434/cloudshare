axios.defaults.baseURL = SERVER

const forgotPassword = async (e) => {
  e.preventDefault()
  const successMessage = document.getElementById('success-message')
  const errorMessage = document.getElementById('error-message')
  const submitBtn = document.getElementById('submit-btn')
  try {
    const form = e.target
    const payload = {
      email: form.elements.email?.value || ""
    }
    
    submitBtn.disabled = true
    submitBtn.innerHTML = `<i class="ri-loader-line animate-spin ml-1"></i> Processing...`

    const {data} = await axios.post('/api/forgot-password', payload)

    successMessage.parentElement.classList.remove('hidden')
    successMessage.innerHTML = data.message

    form.reset()

  } catch (err) {
    errorMessage.parentElement.classList.remove('hidden')
    errorMessage.innerHTML = err.response ? err.response.data.message : err.message
  } finally {
    submitBtn.disabled = false
    submitBtn.innerHTML = `Send Reset Link <i class="ri-arrow-right-line ml-1"></i>`

    setTimeout(() => {
      errorMessage.parentElement.classList.add('hidden')
      successMessage.parentElement.classList.add('hidden')
    }, 2000)
  }
}