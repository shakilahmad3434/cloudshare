axios.defaults.baseURL = SERVER

function toggleDrawer() {
  document.querySelector('.drawer-overlay').classList.toggle('opacity-0');
  document.querySelector('.drawer-overlay').classList.toggle('pointer-events-none');
  document.querySelector('.drawer-overlay').parentElement.classList.toggle('drawer-open')
  }


const uploadFile = async (e) => {
  e.preventDefault();
  alert()
  const form = e.target
  
  try {

    const formData = new FormData(form);
    const {data} = await axios.post('/api/file', formData);
    console.log("File Upload Success:", data);
    
  } catch (error) {
    console.error("File Uploading Error:", error.response?.data || error.message);
  }
}