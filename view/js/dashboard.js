// Set up API defaults and global variables
axios.defaults.baseURL = SERVER;

let storageChartInstance = null;
let fileTypeChartInstance = null;

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
    const {data} = await axios.get('/api/activity?page=1&limit=5', getToken());

    data.activities.forEach((item) => {
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
