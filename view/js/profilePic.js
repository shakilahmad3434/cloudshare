
// change Profile Pic
function changeProfilePic(){
  const inputTag = document.createElement('input')
  const pic = document.getElementById('pic')
  inputTag.type = "file"
  inputTag.accept = "image/*"
  inputTag.name = "picture"
  inputTag.click()
 
  inputTag.addEventListener('change', async (e) => {
    const file = e.target.files[0]

    if(!file)
      return toast.error("error", "Please select profile pic")

    const formData = new FormData()
    formData.append("picture",file)
    try {
      const options = {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...getToken().headers
        }
      }

      await axios.post('/api/profile-picture', formData, options)
      
      pic.src = URL.createObjectURL(file)
    } catch (err) {
      toast.error("error", err.response ? err.response.data.message : err.message)
    }
  })
}

const fetchImage = async ()=>{
  try {
      const options = {
          responseType: 'blob',
          ...getToken()
      }
      const {data} = await axios.get("/api/profile-picture", options)
      const url = URL.createObjectURL(data)
      const pic = document.getElementById("pic")
      pic.src = url
  }   
  catch(err)
  {
      if(!err.response)
          return toast.error("Error", err.message)

      const error = await (err.response.data).text()
      const {message} = JSON.parse(error)
      toast.error("Error", message)
  }
}