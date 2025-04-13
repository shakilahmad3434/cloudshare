axios.defaults.baseURL = SERVER;

//GLobal Variables
const uploadBtn = document.getElementById("uploadBtn");
const uploadModal = document.getElementById("uploadModal");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalContent = document.getElementById("modalContent");
const closeModal = document.getElementById("closeModal");
const cancelUpload = document.getElementById("cancelUpload");

window.onload = () => {
  checkSession()
  fetchFiles()
}
// check session for user logged or not
const checkSession = async () => {
  const session = await getSession()
  
  if(!session)
    return location.href = '/login'
  
  document.getElementById('fullname').innerHTML = session?.fullname
  document.getElementById('email').innerHTML = session?.email
}


// Modal Functions

function openModal() {
  uploadModal.classList.remove("hidden");
  setTimeout(() => {
    modalBackdrop.classList.remove("opacity-0");
    modalContent.classList.remove("modal-enter");
  }, 10);
}

// close Modal Function
function closeModalFunc() {
  modalBackdrop.classList.add("opacity-0");
  modalContent.classList.add("modal-enter");
  setTimeout(() => {
    uploadModal.classList.add("hidden");
  }, 300);
}

//Form Reset
function resetUploadForm() {
  const uploadForm = document.getElementById("uploadForm");
  const progressBar = document.getElementById("progressBar");
  const uploadProgress = document.getElementById("uploadProgress");

  uploadForm.reset();
  progressBar.style.width = "0%";
  uploadProgress.classList.add("hidden");
}

// Event Listeners
uploadBtn.addEventListener("click", openModal);
closeModal.addEventListener("click", closeModalFunc);
cancelUpload.addEventListener("click", closeModalFunc);
modalBackdrop.addEventListener("click", closeModalFunc);

// Prevent backdrop click from closing modal when clicking on modal content
modalContent.addEventListener("click", (e) => {
  e.stopPropagation();
});

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const humanFileSize = (size) =>
  size >= 1e9
    ? (size / 1e9).toFixed(2) + ' GB'
    : size >= 1e6
    ? (size / 1e6).toFixed(2) + ' MB'
    : size >= 1e3
    ? (size / 1e3).toFixed(2) + ' KB'
    : size + ' B';

const getType = (type) => {
  const ext = type.split('/').pop()
  if(ext === "x-msdos-program")
    return 'exe'

  if(ext === "x-msdownload")
    return 'msi'

  return type
}

// Form submission handler
document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const progressBar = document.getElementById("progressBar");
  const uploadPercent = document.getElementById("uploadPercent");
  const uploadProgress = document.getElementById("uploadProgress");
  const uploadSpeed = document.getElementById("uploadSpeed");
  const uploadedSize = document.getElementById('uploadedSize');
  const uploadRemaining = document.getElementById("uploadRemaining");
  const uploadFileName = document.getElementById("uploadFileName");
  const uploadBtn = document.getElementById('upload-btn')
  const startTime = Date.now();

  try {
    const form = e.target
    const formData = new FormData(form)

    const file = formData.get('file')
    const size = humanFileSize(file.size)
    if(size <= "100 MB")
      return toast.error("🔺 Oops! Your file is too large. Please upload a file smaller than 100MB. 📁")

    const options = {
      onUploadProgress: function ({loaded, total, progress, bytes, estimated, rate}) {
        const elapsedTime = (Date.now() - startTime) / 1000; // in seconds
        const uploaded = humanFileSize(loaded);
        const totalSize = humanFileSize(total);
        const percent = (progress * 100).toFixed(2) + '%';
        const speed = humanFileSize(rate || bytes / elapsedTime) + '/s';
        const timeRemaining = estimated
          ? `${Math.ceil(estimated)}s remaining`
          : 'Time Up';
  
        uploadedSize.innerHTML = `${uploaded} / ${totalSize}`;
        uploadPercent.innerHTML = percent
        progressBar.style.width = percent;
        uploadSpeed.innerHTML = speed
        uploadRemaining.innerHTML = timeRemaining

        // Get file name from input or use placeholder
        const fileInput = document.getElementById("fileUpload");
        const fileName =
          fileInput.files.length > 0
            ? fileInput.files[0].name
            : document.getElementById("fileName").value || "file.jpg";

        uploadFileName.textContent = fileName;
            
      },
    }

    uploadBtn.disabled = true
    // Show progress area
    uploadProgress.classList.remove("hidden");
    const {data} = await axios.post('/api/file', formData, options)
    uploadBtn.disabled = false
    fetchFiles()
    // Show success message
    setTimeout(() => {
      toast.success(`${data.filename} has been uploaded!`)
    }, 2000);

  } catch (err) {
    // const errr = JSON.parse((err.response.data).text())
    // console.log(errr)
    toast.error(err.response ? err.response.data.message : err.message)
  } finally {
    setTimeout(() => {
      closeModalFunc();
      resetUploadForm();
    }, 2000);

    uploadBtn.disabled = false
  }

});


// Upload zone drag and drop functionality
const uploadZone = document.querySelector(".upload-zone");
const fileUpload = document.getElementById("fileUpload");

uploadZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploadZone.classList.add("border-emerald-500");
  uploadZone.classList.add("bg-emerald-50");
});

uploadZone.addEventListener("dragleave", (e) => {
  e.preventDefault();
  uploadZone.classList.remove("border-emerald-500");
  uploadZone.classList.remove("bg-emerald-50");
});

uploadZone.addEventListener("drop", (e) => {
  e.preventDefault();
  uploadZone.classList.remove("border-emerald-500");
  uploadZone.classList.remove("bg-emerald-50");

  if (e.dataTransfer.files.length) {
    fileUpload.files = e.dataTransfer.files;
    const fileName = e.dataTransfer.files[0].name;
    document.getElementById("fileName").value = fileName.split(".")[0];
  }
});

// Handle file selection via the browse button
fileUpload.addEventListener("change", (e) => {
  if (fileUpload.files.length) {
    const fileName = fileUpload.files[0].name;
    console.log(fileUpload.files[0].name.split(".")[0])
    document.getElementById("fileName").value = fileName.split(".")[0];
  }
});


const fetchFiles = async () => {
  const tableData = document.getElementById('table-data')
  const totalFiles = document.getElementById('totalFiles')
  try {
    const {data} = await axios.get('/api/file')
    tableData.innerHTML = "";
    totalFiles.innerHTML = `Showing 1-4 of ${data.length + 1} files`
    data.forEach((data) => {
      const ui = `
      <div class="grid grid-cols-12 gap-4 px-6 py-4 items-center transition-all duration-200 file-row" key="${data._id}">
        <div class="col-span-5 flex items-center space-x-3">
          <div class="w-10 h-10 rounded-lg file-image flex items-center justify-center file-icon">
            <i class="ri-image-fill text-xl"></i>
          </div>
          <div class="truncate">
            <span class="font-medium text-gray-800 block truncate capitalize">${data.filename}</span>
            <span class="text-xs text-gray-500">Last modified: ${moment(data.createdAt).format('MMM Do YY, h:mm a')}</span>  
          </div>
        </div>
        <div class="col-span-2 text-gray-600 capitalize">${data.type.split('/')[0]}</div>
        <div class="col-span-2 text-gray-600">${humanFileSize(data.size)}</div>
        <div class="col-span-2 text-gray-600">${moment(data.createdAt).format('MMM Do YY')}</div>
        <div class="col-span-1 flex justify-end space-x-1">
          <button onclick="downloadFile('${data._id}', '${data.filename}', this)" class="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
            <i class="ri-download-cloud-line text-lg"></i>
          </button>
          <button onclick="openModalForShare('${data._id}')" class="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors">
            <i class="ri-share-line text-lg"></i>
          </button>
          <button onclick="deleteFile('${data._id}', this)" class="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors">
            <i class="ri-delete-bin-line text-lg"></i>
          </button>
        </div>
      </div>
      `;

      tableData.innerHTML += ui
    })

  } catch (err) {
    toast.error(err.response ? err.response.data.message : err.message)
  }
}

const deleteFile = async (id, button) => {
  button.innerHTML = `<i class="ri-loader-2-line text-lg animate-spin"></i>`
  button.disabled = true

  const {data} = await axios.delete(`/api/file/${id}`)
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

const downloadFile = async (id, filename, button) => {
  try {
    button.innerHTML = `<i class="ri-loader-2-line text-lg animate-spin"></i>`
    button.disabled = true

    const options = {
      responseType: 'blob'
    }
    const {data} = await axios.get(`/api/file/download/${id}`, options)

    const url = window.URL.createObjectURL(data)
    const a = document.createElement('a')
    a.href=url
    a.download = `${filename}.${getType(data.type)}`
    a.click()
    a.remove()
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


// Start a Share File Coding 

let shareId = null
// Modal toggle function
function openModalForShare(id) {
  const modal = document.getElementById('shareModal');
  modal.classList.toggle('hidden');
  shareId = id
}

// Copy link function
function copyLink() {
  const linkInput = document.getElementById('shareLink');
  linkInput.select();
  document.execCommand('copy');
  
  const copyButton = document.getElementById('copyButton');
  const originalText = copyButton.innerHTML;
  copyButton.innerHTML = '<i class="ri-check-line mr-2"></i>Copied!';
  
  setTimeout(() => {
    copyButton.innerHTML = originalText;
  }, 2000);
}

// Toggle email field
function toggleEmailField() {
  const emailField = document.getElementById('emailField');
  const shareVia = document.getElementById('shareVia');
  
  emailField.classList.remove('hidden');
  shareVia.classList.add('hidden');
}

// Go back to sharing options
function backToOptions() {
  const emailField = document.getElementById('emailField');
  const shareVia = document.getElementById('shareVia');
  
  emailField.classList.add('hidden');
  shareVia.classList.remove('hidden');
}


const shareFile = async (e) => {
  e.preventDefault()

  const sendBtn = document.getElementById('send-email-btn')
  try {

    const form = e.target

    if (!shareId) {
      console.error("No ID found to share.");
      return;
    }
    const payload = {
      email: form.elements.email?.value.trim() || "",
      message: form.elements?.message.value.trim() || "",
      fileId: shareId
    }

    sendBtn.innerHTML = '<i class="ri-loader-2-line mr-2 animate-spin"></i> Processing...'
    sendBtn.disabled = true
    // ri-loader-2-line text-lg animate-spin

    await axios.post('/api/share', payload)
    form.reset()
    toast.success("File send successfully!")

  } catch (err) {
    toast.error(err.response ? err.response.data.message : err.message)
  } finally {
    shareId = null
    sendBtn.innerHTML = '<i class="ri-send-plane-fill mr-2"></i>Send Email'
    sendBtn.disabled = false
  }
}