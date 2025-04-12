const logout = () => {
  window.localStorage.removeItem('fileAuthToken')
  window.sessionStorage.removeItem('fileAuthToken')
  window.location.href = "/login"
}