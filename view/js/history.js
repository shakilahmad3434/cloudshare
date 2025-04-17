axios.defaults.baseURL = SERVER
window.onload = () => {
  checkSession()
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
    default:
      break;
  }
}

const fetchActivity = async () => {
  try {
    const historyActivity = document.getElementById('history-activity')
    const {data} = await axios.get('/api/activity', getToken())
    console.log(data)
    data.forEach((item) => {
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
                    <div class="w-1/5 text-sm text-gray-700">${moment(data.createdAt).format('MMM DD YYYY, h:mm A')}</div>
                </div>`
      historyActivity.innerHTML +=ui
    })
  } catch (err) {
    console.log(err.response ? err.response.data.message : err.message)
  }
}