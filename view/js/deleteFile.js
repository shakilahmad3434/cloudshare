axios.defaults.baseURL = SERVER

const deleteFile = async (id, button) => {
  button.innerHTML = `<i class="ri-loader-2-line text-lg animate-spin"></i>`
  button.disabled = true

  const {data} = await axios.delete(`/api/file/${id}`, getToken())
  toast.success(data.message)
  fetchFiles()
  try {
  } catch (err) {
    toast.error(err.response ? err.response.data.message : err.message)
  } finally {
    button.innerHTML = `<i class="ri-delete-bin-line text-lg"></i>`
    button.disabled = false
  }
}