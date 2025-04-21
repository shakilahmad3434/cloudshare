// Storage Usage Chart
const storageCtx = document.getElementById('storageChart').getContext('2d');
const storageChart = new Chart(storageCtx, {
    type: 'doughnut',
    data: {
        labels: ['Used', 'Free'],
        datasets: [{
            data: [73, 27],
            backgroundColor: ['#10b981', '#e5e7eb'],
            borderWidth: 0
        }]
    },
    options: {
        cutout: '70%',
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                enabled: false
            }
        }
    }
});

// File Type Distribution Chart
const fileTypeCtx = document.getElementById('fileTypeChart').getContext('2d');
const fileTypeChart = new Chart(fileTypeCtx, {
    type: 'doughnut',
    data: {
        labels: ['Images', 'Documents', 'Videos', 'Audio'],
        datasets: [{
            data: [243, 153, 45, 67],
            backgroundColor: ['#60a5fa', '#fbbf24', '#f87171', '#c084fc'],
            borderWidth: 0
        }]
    },
    options: {
        cutout: '70%',
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                display: false
            }
        }
    }
});


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
      
      const { data } = await axios.get('/api/file-details', getToken());
      
      // Calculate storage metrics
      const totalStorage = Number(data.MAX_STORAGE_PER_USER);
      const usedStorage = data.file.reduce((acc, file) => acc + file.size, 0);
      const freeStorage = totalStorage - usedStorage;
  
      document.getElementById('used-storage').innerHTML = `Used: ${humanFileSize(usedStorage)}`
      document.getElementById('free-storage').innerHTML = `Free: ${humanFileSize(freeStorage)}`
      document.getElementById('total-storage').innerHTML = `Total: ${humanFileSize(totalStorage)}`
  
      
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