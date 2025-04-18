axios.defaults.baseURL = SERVER
window.onload = () => {
  checkSession(),
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

const fetchShared = async () => {
  try {
    const recentSharedFiles = document.getElementById('recent-shared-files')
    const {data} = await axios.get('/api/share', getToken())

    recentSharedFiles.innerHTML = ""
    data.forEach((data) => {
      console.log(data)
      const ui = `
      <tr class="hover:bg-gray-50">
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex items-center">
            <div class="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-blue-50 rounded-lg">
              <i class="ri-file-word-2-line text-blue-500 text-xl"></i>
            </div>
            <div class="ml-4">
              <div class="text-sm font-medium text-gray-900 capitalize">${data.file.filename}.${data.file.type.split('/').pop()}</div>
              <div class="text-sm text-gray-500">${humanFileSize(data.file.size)}</div>
            </div>
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex items-center">
            <div class="flex-shrink-0 h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-medium">JD</div>
            <div class="ml-3">
              <div class="text-sm font-medium text-gray-900">John Doe</div>
              <div class="text-sm text-gray-500">${data.receiverEmail}</div>
            </div>
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm text-gray-900">${moment(data.createdAt).format("ll")}</div>
          <div class="text-sm text-gray-500">${moment(data.createdAt).format("hh:mm A")}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex items-center">
            <i class="ri-eye-line text-gray-500 mr-1"></i>
            <span class="text-sm text-gray-500">Viewed 2 hours ago</span>
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          May 12, 2025
        </td>
      </tr>`;
      recentSharedFiles.innerHTML +=ui
    })
   
  } catch (err) {
    toast.error(err.response ? err.response.data.message : err.message)
  }
}