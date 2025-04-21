axios.defaults.baseURL = SERVER

// Global Variables
const passwordInput = document.getElementById('password-input');

window.onload = () => {
  checkSession()
}

const checkSession = async () => {
  const session = await getSession()
  if(session){
    location.href = '/dashboard'
  }
}

function isStrongPassword(password) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+\[\]{}|;:,.<>?]).{8,}$/;
  return regex.test(password);
}

function validatePassword(inputValue) {
  const passwordProgress = document.getElementById('password-progress');
  const passwordProgressBar = document.getElementById('password-progress-bar');
  const hasUpper = /[A-Z]/.test(inputValue);
  const hasLower = /[a-z]/.test(inputValue);
  const hasNumber = /[0-9]/.test(inputValue);
  const hasSymbol = /[!@#$%^&*()\-_=+\[\]{}|;:,.<>?]/.test(inputValue);
  const isLong = inputValue.length >= 8;

  // Show/hide progress section
  passwordProgress.classList.toggle('hidden', inputValue.length <= 1);

  // Strength
  let strength = 0;
  if (isLong) strength++;
  if (hasUpper && hasLower) strength++;
  if (hasNumber) strength++;
  if (hasSymbol) strength++;

  passwordProgressBar.classList.remove('bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500');

  const colors = ['bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
  const widths = ['25%', '50%', '75%', '100%'];

  if (strength > 0) {
    passwordProgressBar.classList.add(colors[strength - 1]);
    passwordProgressBar.style.width = widths[strength - 1];
  } else {
    passwordProgressBar.classList.add('bg-red-500');
    passwordProgressBar.style.width = '25%';
  }
}

passwordInput.addEventListener('keyup', (e) => {
  validatePassword(e.target.value);
});

const signup = async (e) => {
  e.preventDefault()
  const signupBtn = document.getElementById('signup-btn')
  try {
    const form = e.target
    const element = form.elements
    const payload = {
      fullname: element.fullname?.value || "",
      mobile: element.mobile?.value || "",
      email: element.email?.value || "",
      password: element.password?.value || ""
    }

    signupBtn.innerHTML = `<i class="ri-loader-4-line mr-1 animate-spin"></i> Processing...`
    signupBtn.disabled = true

    if(!isStrongPassword(passwordInput.value))
      return toast.error('Error', "Use 8+ characters: include uppercase, lowercase, numbers, and symbols.")

    const {data} = await axios.post('/api/signup', payload)
    form.reset()
    toast.success('Success', data.message)

    setTimeout(() => {
      window.location.href = '/login'
    }, 3000)

  } catch (error) {
    toast.error('Error', error.response ? error.response.data.message : error.message)
  } finally {
    signupBtn.innerHTML = `Create Account <i class="ri-arrow-right-line ml-2"></i>`
    signupBtn.disabled = false
  }
}