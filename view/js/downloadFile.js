axios.defaults.baseURL = SERVER 

const downloadFile = async (id, filename, ext, button) => {
  try {

    button.innerHTML = `<i class="ri-loader-2-line text-lg animate-spin"></i>`
    button.disabled = true

    const options = {
      responseType: 'blob',
      ...getToken()
    }
    const {data} = await axios.get(`/api/file/download/${id}`, options)

    if(!data || data.size === 0)
      throw new Error('Downloaded file is empty')

    const url = window.URL.createObjectURL(data)

    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.${ext}`
    document.body.appendChild(a)
    a.click()

    setTimeout(() => {
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 100);
 
  } catch (err) {
    if(!err.response)
      return toast.error(err.message)

    const error = await (err.response.data).text()
    const {message} = JSON.parse(error)
    toast.error(message)
  } finally {
    button.innerHTML = `<i class="ri-download-cloud-line text-lg"></i>`
    button.disabled = false
  }
}