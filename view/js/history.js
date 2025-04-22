axios.defaults.baseURL = SERVER

// Global Variables
let currentPage = 1;
const limit = 10;

window.onload = () => {
  checkSession()
  fetchImage()
  fetchActivity()
}

const checkSession = async () => {
  const session = await getSession()
  
  if(!session)
    return location.href = '/login'
  
  document.getElementById('fullname').innerHTML = session?.fullname
  document.getElementById('email').innerHTML = session?.email
}

const getToken = () => {
  const options = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('fileAuthToken')}`
    }
  }
  return options
}

const getActivity = (action, email = undefined) => {
  switch (action) {
    case 'upload':  return 'File Uploaded/You uploaded a new file'
    case 'rename': return 'File Modified/You modified a document'
    case 'share': return `File Shared/You shared a file with ${email}`
    case 'delete': return 'File Deleted/You moved a file to trash'
    case 'download': return 'File Downloaded/You downloaded a file'
    case 'shared-download': return `File Shared Downloaded/You downloaded a shared file`
    default:
      break;
  }
}

const fetchActivity = async (page = 1) => {
  try {
    const historyActivity = document.getElementById('history-activity')
    const {data} = await axios.get(`/api/activity?page=${page}&limit=${limit}`, getToken())

    historyActivity.innerHTML = ""

    data.activities.forEach((item) => {
      const filename = item?.filename ? item.filename : `<span class="capitalize">${item.fileId.filename}</span>.${item.fileId.extension}`
      const fileType = item?.filename ? item.filename.split('.').pop() : item.fileId?.type.split('/')[0]
      const [fileAction, fileActivity] = getActivity(item.action, item.shareId?.receiverEmail).split('/')
      const [icon, color] = getActivityIcon(item.action).split(" ")

      const ui = `<div class="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                    <div class="w-2/5 flex items-center">
                        <div class="h-10 w-10 rounded-full bg-${color}-100 flex items-center justify-center mr-4">
                            <i class="ri-${icon} text-${color}-500"></i>
                        </div>
                        <div>
                            <p class="font-medium text-gray-800">${fileAction}</p>
                            <p class="text-sm text-gray-500">${fileActivity}</p>
                        </div>
                    </div>
                    <div class="w-1/5 text-sm text-gray-700">${filename}</div>
                    <div class="w-1/5 text-sm text-gray-700 capitalize">${fileType}</div>
                    <div class="w-1/5 text-sm text-gray-700">${moment(item.createdAt).format('MMM DD YYYY, h:mm A')}</div>
                </div>`
      historyActivity.innerHTML +=ui
    })

    updatePagination(data.currentPage, data.totalPages, data.total);
  } catch (err) {
    toast.error("Error",err.response ? err.response.data.message : err.message)
  }
}

const updatePagination = (currentPage, totalPages, total) => {
  const paginationInfo = document.getElementById('totalFiles');
  const paginationButtons = document.getElementById('pagination-buttons');
  paginationButtons.innerHTML = '';

  // Generate pagination buttons
  let buttonsHTML = `
  <button id="prevBtn" onclick="prevFun()" class="p-2 rounded text-gray-500 hover:bg-gray-200">
    <i class="ri-arrow-left-s-line"></i>
  </button>`;

const visiblePages = getVisiblePages(currentPage, totalPages)

visiblePages.forEach(p => {
  if (p === '...') {
    buttonsHTML += `<span class="px-2">...</span>`;
  } else {
    buttonsHTML += `<button 
      class="px-3 py-1 rounded ${p === currentPage ? 'bg-emerald-600 text-white' : 'hover:bg-gray-200 text-gray-700'}"
      onclick="goToPage(${p})">${p}</button>`;
  }
});

buttonsHTML += `
  <button id="nextBtn" onclick="nextFun('${totalPages}')" class="p-2 rounded text-gray-500 hover:bg-gray-200">
    <i class="ri-arrow-right-s-line"></i>
  </button>`;

paginationButtons.innerHTML = buttonsHTML;

paginationInfo.innerHTML = `Showing ${currentPage} - ${totalPages} of ${total} files`;

document.getElementById('prevBtn').disabled = currentPage === 1;
document.getElementById('nextBtn').disabled = currentPage === totalPages;
};

function prevFun() {
  if (currentPage > 1) {
    currentPage--;
    fetchActivity(currentPage);
  }
}

function goToPage(page) {
  currentPage = Number(page);
  fetchActivity(currentPage);
}

function nextFun(totalPages) {
  if (currentPage < totalPages) {
    currentPage++;
    fetchActivity(currentPage);
  }
}