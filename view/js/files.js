function toggleDrawer() {
  document.querySelector('.drawer-overlay').classList.toggle('opacity-0');
  document.querySelector('.drawer-overlay').classList.toggle('pointer-events-none');
  document.querySelector('.drawer-overlay').parentElement.classList.toggle('drawer-open')
  }

async function myFile(){
  
  const fileInput = document.getElementById('uploadFile');
  if (!fileInput || !fileInput.files.length) {
    console.error("No file selected!");
    return;
  }

  const formData = new FormData();
  formData.append('file', fileInput.files[0]);

  try {
    const response = await axios.post('/file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log("File Upload Success:", response.data);
    
  } catch (error) {
    console.error("File Uploading Error:", error.response?.data || error.message);
  }
}