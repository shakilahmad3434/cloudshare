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
}

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

function closeModalFunc() {
  modalBackdrop.classList.add("opacity-0");
  modalContent.classList.add("modal-enter");
  setTimeout(() => {
    uploadModal.classList.add("hidden");
  }, 300);
}

// Simulated Upload Function
function simulateUpload() {
  const progressBar = document.getElementById("progressBar");
  const uploadPercent = document.getElementById("uploadPercent");
  const uploadProgress = document.getElementById("uploadProgress");
  const uploadSpeed = document.getElementById("uploadSpeed");
  const uploadRemaining = document.getElementById("uploadRemaining");
  const uploadFileName = document.getElementById("uploadFileName");

  let progress = 0;
  let simulationInterval;

  // Show progress area
  uploadProgress.classList.remove("hidden");

  // Get file name from input or use placeholder
  const fileInput = document.getElementById("fileUpload");
  const fileName =
    fileInput.files.length > 0
      ? fileInput.files[0].name
      : document.getElementById("fileName").value || "file.jpg";

  uploadFileName.textContent = fileName;

  // Start progress simulation
  simulationInterval = setInterval(() => {
    progress += Math.random() * 8;
    if (progress >= 100) {
      progress = 100;
      clearInterval(simulationInterval);

      // Show success message
      setTimeout(() => {
        alert("File uploaded successfully!");
        closeModalFunc();
        resetUploadForm();
      }, 500);
    }

    // Update UI
    progressBar.style.width = `${progress}%`;
    uploadPercent.textContent = `${Math.round(progress)}%`;

    // Simulate speed and remaining time
    const speed = Math.round(Math.random() * 1000) + 500;
    uploadSpeed.textContent = `${speed} KB/s`;

    const remaining = Math.round(((100 - progress) * 100) / speed);
    if (remaining <= 0) {
      uploadRemaining.textContent = "finishing...";
    } else {
      uploadRemaining.textContent = `${remaining} seconds left`;
    }
  }, 200);
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

// Form submission handler
document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const form = e.target
    console.log(form)
    const formData = new FormData(form)
    const {data} = await axios.post('/api/file', formData)
    console.log(data)

  } catch (err) {
    console.log(err)
    console.log(err.response ? err.response.data.message : err.message)
  }
  simulateUpload();
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
