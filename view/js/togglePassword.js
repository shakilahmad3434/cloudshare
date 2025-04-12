function togglePasswordVisibility() {
  const passwordInput = document.getElementById('password');
  const toggleIcon = document.getElementById('togglePassword');
  
  if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      toggleIcon.classList.remove('ri-eye-line');
      toggleIcon.classList.add('ri-eye-off-line');
  } else {
      passwordInput.type = 'password';
      toggleIcon.classList.remove('ri-eye-off-line');
      toggleIcon.classList.add('ri-eye-line');
  }
}