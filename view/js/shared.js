axios.defaults.baseURL = SERVER

// Global Variables
let currentPage = 1;
const limit = 10;

window.onload = () => {
  checkSession()
  fetchImage()
  fetchShared()
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

const humanFileSize = (size) =>
  size >= 1e9
    ? (size / 1e9).toFixed(2) + ' GB'
    : size >= 1e6
    ? (size / 1e6).toFixed(2) + ' MB'
    : size >= 1e3
    ? (size / 1e3).toFixed(2) + ' KB'
    : size + ' B';

const fetchShared = async (page = 1) => {
  try {
    const recentSharedFiles = document.getElementById('recent-shared-files')
    const {data} = await axios.get(`/api/share?page=${page}&limit=${limit}`, getToken())
    console.log(data)
    recentSharedFiles.innerHTML = ""

    data.history.forEach((data) => {
      const fileIcon = getFileIcon(data.file.extension);
      const [iconName, colorName] = fileIcon.split(' ');
      const ui = `
      <tr class="hover:bg-gray-50">
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex items-center">
            <div class="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-${colorName}-50 rounded-lg">
              <i class="ri-${iconName}-line text-${colorName}-500 text-xl"></i>
            </div>
            <div class="ml-4">
              <div class="text-sm font-medium text-gray-900"><span class="capitalize truncate">${data.file.filename}</span>.${data.file.extension}</div>
              <div class="text-sm text-gray-500">${humanFileSize(data.file.size)}</div>
            </div>
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500">${data.receiverEmail}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm text-gray-900">${moment(data.createdAt).format("ll")}</div>
          <div class="text-sm text-gray-500">${moment(data.createdAt).format("hh:mm A")}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex items-center">
            <i class="ri-eye-line text-gray-500 mr-1"></i>
            <span class="text-sm text-gray-500">Viewed ${data.track ? moment(data.track.seenAt).fromNow(): "N/A"}</span>
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm ${data.link && moment().isAfter(data.link.expiresAt) ? 'text-red-500' : 'text-gray-500'}">
        ${data.link 
          ? moment().isAfter(data.link.expiresAt) 
            ? "Expired" 
            : `Expires ${moment(data.link.expiresAt).fromNow()}` 
          : "N/A"}
      </td>
      </tr>`;
      recentSharedFiles.innerHTML +=ui
    })

    updatePagination(data.currentPage, data.totalPages, data.total);
   
  } catch (err) {
    toast.error(err.response ? err.response.data.message : err.message)
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
    fetchShared(currentPage);
  }
}

function goToPage(page) {
  currentPage = Number(page);
  fetchShared(currentPage);
}

function nextFun(totalPages) {
  if (currentPage < totalPages) {
    currentPage++;
    fetchShared(currentPage);
  }
}