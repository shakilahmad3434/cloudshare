function toggleSidebar() {
  const sidebar = document.getElementById('sidebar')
  
  if(sidebar.classList.contains('w-64')){
    sidebar.classList.remove('w-64')
    sidebar.classList.add('w-0')
  }
  else{

    sidebar.classList.remove('w-0')
    sidebar.classList.add('w-64')
  }
}