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
  console.log(session)
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
  document.getElementById("fileName").value = ""
  document.getElementById("fileUpload").value = ""
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
    return 'application/exe'

  if(ext === "x-msdownload")
    return 'applicatio/msi'

  return type
}

const getToken = () => {
  const options = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('fileAuthToken')}`
    }
  }
  return options
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
    if(file.size > (100 * 1000 * 1000))
      return toast.error("Error","🔺 Oops! Your file is too large. Please upload a file smaller than 100MB. 📁")

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
      ...getToken()
    }

    uploadBtn.disabled = true
    uploadProgress.classList.remove("hidden");

    const {data} = await axios.post('/api/file', formData, options)

    setTimeout(() => {
      closeModalFunc();
      resetUploadForm();
    }, 2000);

    toast.success("Success",`${data.data.filename} has been uploaded!`)
    fetchFiles()

  } catch (err) {
    toast.error("Error",err.response ? err.response.data.message : err.message)
  } finally {
    uploadBtn.disabled = false
  }
});


// Handle file selection via the browse button
fileUpload.addEventListener("change", (e) => {
  if (fileUpload.files.length) {
    const fileName = fileUpload.files[0].name;
    console.log(fileUpload.files[0].name.split(".")[0])
    document.getElementById("fileName").value = fileName.split(".")[0];
    document.getElementById('fileName').focus()
  }
});


let currentPage = 1;
  const limit = 10;

const fetchFiles = async (page = 1) => {
  const tableData = document.getElementById('table-data');
  try {
    const { data } = await axios.get(`/api/file?page=${page}&limit=${limit}`, getToken());
    const { files, total, page: pageNo, totalPages } = data;
    console.log(data)
    tableData.innerHTML = "";
    files.forEach((data) => {
      const fileIcon = getFileIcon(data.extension);
      const [iconName, colorName] = fileIcon.split(' ');
      const ui = `
        <div class="grid grid-cols-12 gap-4 px-6 py-4 items-center transition-all duration-200 file-row" key="${data._id}">
          <div class="col-span-5 flex items-center space-x-3">
            <div class="w-10 h-10 flex items-center justify-center bg-${colorName}-100 rounded-lg mr-3">
            <i class="ri-${iconName}-line text-${colorName}-500 text-xl"></i>
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
            <button onclick="downloadFile('${data._id}', '${data.filename}', '${data.extension}', this)" class="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
              <i class="ri-download-cloud-line text-lg"></i>
            </button>
            <button onclick="openModalForShare('${data._id}', '${data.filename}', '${data.extension}', '${data.type}', '${data.size}', '${iconName}', '${colorName}')" class="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors">
              <i class="ri-share-line text-lg"></i>
            </button>
            <button onclick="deleteFile('${data._id}', this)" class="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors">
              <i class="ri-delete-bin-line text-lg"></i>
            </button>
          </div>
        </div>
      `;
      tableData.innerHTML += ui;
    });

    updatePagination(pageNo, totalPages, total);
  } catch (err) {
    toast.error("Error",err.response ? err.response.data.message : err.message);
  }
};

const updatePagination = (page, totalPages, total) => {
  const totalFiles = document.getElementById('totalFiles');
  const paginationContainer = document.getElementById('pagination-buttons');
  paginationContainer.innerHTML = '';

  // Previous button
  const prevBtn = document.createElement('button');
  prevBtn.className = 'p-2 rounded text-gray-500 hover:bg-gray-200';
  prevBtn.disabled = page === 1;
  prevBtn.innerHTML = `<i class="ri-arrow-left-s-line"></i>`;
  prevBtn.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      fetchFiles(currentPage);
    }
  };
  paginationContainer.appendChild(prevBtn);

  // Page number buttons
  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement('button');
    pageBtn.className = `px-3 py-1 rounded ${i === page ? 'bg-emerald-600 text-white' : 'hover:bg-gray-200 text-gray-700'}`;
    pageBtn.textContent = i;
    pageBtn.onclick = () => {
      currentPage = i;
      fetchFiles(currentPage);
    };
    paginationContainer.appendChild(pageBtn);
  }

  // Next button
  const nextBtn = document.createElement('button');
  nextBtn.className = 'p-2 rounded text-gray-500 hover:bg-gray-200';
  nextBtn.disabled = page === totalPages;
  nextBtn.innerHTML = `<i class="ri-arrow-right-s-line"></i>`;
  nextBtn.onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      fetchFiles(currentPage);
    }
  };
  paginationContainer.appendChild(nextBtn);

  // Showing 1-10 of 56 files
  const start = (page - 1) * limit + 1;
  const end = Math.min(start + limit - 1, total);
  totalFiles.innerHTML = `Showing ${start}-${end} of ${total} files`;
};


// Start a Share File Coding 
let shareId = null
const linkInput = document.getElementById('shareLink');
const shareFilePreview = document.getElementById('share-file-preview')
const modal = document.getElementById('shareModal');

// Modal toggle function
function openModalForShare(id, filename, extension, type, size, iconName, colorName) {
  modal.classList.remove('hidden')
  linkInput.value = `${SERVER}/api/file/download/${id}`;
  shareFilePreview.innerHTML = `<div class="bg-${colorName}-100 p-3 rounded-xl mr-4 flex items-center justify-center">
                                <i class="ri-${iconName}-line text-${colorName}-600 text-2xl"></i>
                              </div>
                              <div class="flex-1">
                                <h4 class="font-medium text-gray-800"><span class="capitalize">${filename}</span>.${extension}</h4>
                                <p class="text-sm text-gray-500">${humanFileSize(size)} • ${type.split('/')[0]}</p>
                              </div>`;
  
  shareId = id
}

function closeModalForShare() {
  modal.classList.add('hidden')
}

// Copy link function
function copyLink() {
  linkInput.select();
  document.execCommand('copy');
  
  const copyButton = document.getElementById('copyButton');
  const originalText = copyButton.innerHTML;
  copyButton.innerHTML = '<i class="ri-check-line mr-2"></i>Copied!';
  
  setTimeout(() => {
    copyButton.innerHTML = originalText;
  }, 2000);
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

    await axios.post('/api/share', payload, getToken())

    form.reset()
    toast.success("Success","File send successfully!")

    setTimeout(() => {
      modal.classList.add('hidden')
    }, 2000)

  } catch (err) {
    toast.error("Error",err.response ? err.response.data.message : err.message)
  } finally {
    shareId = null
    sendBtn.innerHTML = '<i class="ri-send-plane-fill mr-2"></i>Send Email'
    sendBtn.disabled = false
  }
}