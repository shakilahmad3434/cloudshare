// Set up API defaults and global variables
axios.defaults.baseURL = SERVER;

// Track chart instances globally to prevent memory leaks
let storageChartInstance = null;
let fileTypeChartInstance = null;
let activityChartInstance = null;

// Initialize the dashboard when the page loads
window.onload = () => {
  checkSession();
  fetchRecentFiles();
  fetchSharedFiles();
  fetchFileDetails();
};

// Verify the user is logged in, redirect if not
const checkSession = async () => {
  const session = await getSession();
  console.log(session);
  
  if (!session) {
    return location.href = '/login';
  }
  
  document.getElementById('fullname').innerHTML = session?.fullname;
  document.getElementById('email').innerHTML = session?.email;
};

// Helper function to get authentication headers
const getToken = () => {
  return {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('fileAuthToken')}`
    }
  };
};

// Convert file sizes to human-readable format
const humanFileSize = (size) => {
  if (size >= 1e9) return (size / 1e9).toFixed(2) + ' GB';
  if (size >= 1e6) return (size / 1e6).toFixed(2) + ' MB';
  if (size >= 1e3) return (size / 1e3).toFixed(2) + ' KB';
  return size + ' B';
};


// Fetch and display recent files
const fetchRecentFiles = async () => {
  const recentFileBox = document.getElementById('recent-file-box');
  if (!recentFileBox) return;
  
  try {
    const { data } = await axios.get('/api/file?page=1&limit=5', getToken());
    console.log('Recent files:', data);
    
    recentFileBox.innerHTML = '';
    
    data.files.forEach((item) => {
      const fileIcon = getFileIcon(item.extension);
      const [iconName, colorName] = fileIcon.split(' ');
      
      const ui = `
        <div class="flex items-center border-b pb-3">
          <div class="w-10 h-10 flex items-center justify-center bg-${colorName}-100 rounded-lg mr-3">
            <i class="ri-${iconName}-line text-${colorName}-500"></i>
          </div>
          <div class="flex-1">
            <h4 class="text-sm font-medium text-gray-800">${item.filename}.${item.extension}</h4>
            <p class="text-xs text-gray-500">${humanFileSize(item.size)} • ${moment(item.createdAt).format('ll')}</p>
          </div>
          <div>
            <button onclick="downloadFile('${item._id}', '${item.filename}', '${item.extension}', this)" class="text-gray-500 hover:text-gray-700">
              <i class="ri-download-cloud-line"></i>
            </button>
          </div>
        </div>`;
      
      recentFileBox.innerHTML += ui;
    });
  } catch (err) {
    console.error('Error fetching recent files:', err.response ? err.response.data.message : err.message);
  }
};

// Fetch shared files
const fetchSharedFiles = async () => {
  try {
    const recentActivityBox = document.getElementById('recent-activity-box')
    const { data } = await axios.get('/api/activity', getToken());
    console.log('Shared files:', data);

    data.forEach((item) => {
      const filename = item?.filename ? item.filename : `<span class="capitalize">${item.fileId.filename}</span>.${item.fileId.extension}`
      const [icon, color] = getActivityIcon(item.action).split(" ")
      const ui = `<div class="flex items-start border-b pb-3">
                    <div class="w-10 h-10 flex items-center justify-center bg-${color}-100 rounded-lg mr-3">
                        <i class="ri-${icon} text-${color}-500"></i>
                    </div>
                    <div class="flex-1">
                        <h4 class="text-sm font-medium text-gray-800">${filename}</h4>
                        <p class="text-xs text-gray-500">${moment(data.createdAt).format('MMM DD YYYY, h:mm A')}</p>
                    </div>
                  </div>`
      recentActivityBox.innerHTML +=ui
    })

  } catch (err) {
    console.error('Error fetching shared files:', err.response ? err.response.data.message : err.message);
  }
};

// Ensure Chart.js is loaded before trying to use it
const ensureChartJsLoaded = () => {
  return new Promise((resolve) => {
    if (window.Chart) {
      resolve();
      return;
    }
    
    const checkInterval = setInterval(() => {
      if (window.Chart) {
        clearInterval(checkInterval);
        resolve();
      }
    }, 100);
    
    // Timeout after 5 seconds
    setTimeout(() => {
      clearInterval(checkInterval);
      console.error("Chart.js loading timed out");
      resolve(); // Resolve anyway to prevent hanging
    }, 5000);
  });
};

// Helper function to safely destroy a chart
const safelyDestroyChart = (chartInstance, canvasId) => {
  // First check if we have a reference to the chart
  if (chartInstance) {
    try {
      chartInstance.destroy();
    } catch (e) {
      console.warn(`Failed to destroy chart via instance reference: ${e.message}`);
    }
  }

  // As a fallback, try to destroy via Chart.js internal registry
  const canvas = document.getElementById(canvasId);
  if (canvas && window.Chart && Chart.instances) {
    // Look through all chart instances
    Object.values(Chart.instances).forEach(instance => {
      // If this chart instance is associated with our canvas
      if (instance.canvas === canvas) {
        try {
          instance.destroy();
          console.log(`Destroyed chart instance via Chart.js registry`);
        } catch (e) {
          console.warn(`Failed to destroy chart via Chart.js registry: ${e.message}`);
        }
      }
    });
  }
};

// Initialize the storage usage chart
const initStorageChart = (usedStorage, freeStorage) => {
  const canvasId = "storageChart";
  
  // Safely destroy any existing chart
  safelyDestroyChart(storageChartInstance, canvasId);
  
  // Get a fresh canvas context
  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.error(`Canvas element with ID ${canvasId} not found`);
    return;
  }
  
  const ctx = canvas.getContext("2d");
  
  // Calculate percentage for display
  const totalStorage = parseFloat(usedStorage) + parseFloat(freeStorage);
  const usedPercentage = totalStorage > 0 
    ? Math.round((parseFloat(usedStorage) / totalStorage) * 100) 
    : 0;
  
  // Update percentage display
  const percentageDisplay = canvas.parentElement.querySelector('.text-lg');
  if (percentageDisplay) {
    percentageDisplay.textContent = `${usedPercentage}%`;
  }

  // Create new chart
  try {
    storageChartInstance = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Used", "Free"],
        datasets: [{
          data: [usedStorage, freeStorage],
          backgroundColor: ["#10B981", "#E5E7EB"],
          borderWidth: 0
        }]
      },
      options: {
        cutout: "70%",
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.label}: ${context.raw} GB`;
              }
            }
          }
        }
      }
    });
    console.log("Storage chart created successfully");
  } catch (e) {
    console.error("Failed to create storage chart:", e);
  }
};

// Initialize the file type distribution chart
const initFileTypeChart = (fileData) => {
  const canvasId = "fileTypeChart";
  
  // Safely destroy any existing chart
  safelyDestroyChart(fileTypeChartInstance, canvasId);
  
  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.error(`Canvas element with ID ${canvasId} not found`);
    return;
  }
  
  const ctx = canvas.getContext("2d");

  // Create new chart
  try {
    fileTypeChartInstance = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Images", "Videos", "Audio", "Documents"],
        datasets: [{
          data: [fileData.image, fileData.video, fileData.audio, fileData.document],
          backgroundColor: ["#60A5FA", "#F87171", "#A78BFA", "#FBBF24"],
          borderWidth: 0
        }]
      },
      options: {
        cutout: "65%",
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed || 0;
                return `${label}: ${value} files`;
              }
            }
          }
        }
      }
    });
    console.log("File type chart created successfully");
  } catch (e) {
    console.error("Failed to create file type chart:", e);
  }
};

// Initialize all charts with the provided data
const initCharts = (usedStorage, freeStorage, fileData) => {
  // Wait a bit to ensure Chart.js is fully initialized
  setTimeout(() => {
    initStorageChart(
      (usedStorage / 1e9).toFixed(1), 
      (freeStorage / 1e9).toFixed(1)
    );
    
    initFileTypeChart(fileData);
    
    // Additional charts could be initialized here
  }, 100);
};

// Fetch file details and update dashboard metrics
const fetchFileDetails = async () => {
  try {
    const numberOfAudio = document.getElementById('number-of-audio');
    const numberOfImage = document.getElementById('number-of-image');
    const numberOfVideo = document.getElementById('number-of-video');
    const numberOfDocument = document.getElementById('number-of-document');
    const storageLimit = document.getElementById('storage-limit');
    
    const { data } = await axios.get('/api/file-details', getToken());
    console.log('File details:', data);
    
    // Calculate storage metrics
    const totalStorage = Number(data.MAX_STORAGE_PER_USER);
    const usedStorage = data.file.reduce((acc, file) => acc + file.size, 0);
    const freeStorage = totalStorage - usedStorage;

    document.getElementById('used-storage').innerHTML = `Used: ${humanFileSize(usedStorage)}`
    document.getElementById('free-storage').innerHTML = `Free: ${humanFileSize(freeStorage)}`
    document.getElementById('total-storage').innerHTML = `Total: ${humanFileSize(totalStorage)}`

    // Update storage display
    if (storageLimit) {
      storageLimit.innerHTML = `${humanFileSize(usedStorage)} used`;
    }
    
    // Count files by type
    const noOfFile = {
      image: 0,
      video: 0,
      audio: 0,
      document: 0
    };

    data.file.forEach((item) => {
      const type = item.type.split("/")[0];

      switch (type) {
        case "image": 
          noOfFile.image++;
          break;
        case "video": 
          noOfFile.video++;
          break;
        case "audio": 
          noOfFile.audio++;
          break;
        default: 
          noOfFile.document++;
          break;
      }
    });

    // Update file count displays
    if (numberOfAudio) numberOfAudio.innerHTML = `Audio: ${noOfFile.audio} files`;
    if (numberOfVideo) numberOfVideo.innerHTML = `Videos: ${noOfFile.video} files`;
    if (numberOfImage) numberOfImage.innerHTML = `Images: ${noOfFile.image} files`;
    if (numberOfDocument) numberOfDocument.innerHTML = `Documents: ${noOfFile.document} files`;

    // Make sure Chart.js is loaded before initializing charts
    await ensureChartJsLoaded();
    
    // Initialize charts with the fetched data
    initCharts(usedStorage, freeStorage, noOfFile);
    
  } catch (err) {
    console.error('Error fetching file details:', err.response ? err.response.data.message : err.message);
  }
};