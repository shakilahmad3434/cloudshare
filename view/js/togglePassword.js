function togglePasswordVisibility(e) {
  const target = e.target
  if(target.tagName === "I"){
    const toggleIcon = target
    const passwordInput = e.target.parentElement.previousElementSibling

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

}