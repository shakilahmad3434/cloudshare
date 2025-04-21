axios.defaults.baseURL = SERVER

// Global Variables
const passwordInput = document.getElementById('password-input');

window.onload = async () => {
  checkSession()
  // Initialize
await fetchCountries();
}

const checkSession = async () => {
  const session = await getSession()
  if(session){
    location.href = '/dashboard'
  }
}

// DOM Elements
const countrySelector = document.getElementById('countrySelector');
const selectedFlag = document.getElementById('selectedFlag');
const selectedDialCode = document.getElementById('selectedDialCode');
const countryDropdown = document.getElementById('countryDropdown');
const searchInput = document.getElementById('searchInput');
const countriesList = document.getElementById('countriesList');
const phoneInput = document.getElementById('phoneInput');

// State variables
let countries = [];
let selectedCountry = null;

async function getCountryName() {
  const {data} = await axios.get('https://ipapi.co/json/')
  return data.country
}


// Fetch countries data
async function fetchCountries() {
  try {
      const response = await fetch('https://restcountries.com/v3.1/all');
      const data = await response.json();
      const countryShortName = await getCountryName()
      
      // Process and format country data
      countries = data
          .filter(country => country.idd && country.idd.root)
          .map(country => ({
              name: country.name.common,
              code: country.cca2,
              dialCode: `${country.idd.root}${country.idd.suffixes ? country.idd.suffixes[0] : ''}`,
              flag: country.flags.svg || `https://flagcdn.com/${country.cca2.toLowerCase()}.svg`
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
      
      // Set default to Nigeria (+91) as seen in the image
      const nigeria = countries.find(c => c.code === countryShortName);
      if (nigeria) {
          setSelectedCountry(nigeria);
      } else if (countries.length > 0) {
          setSelectedCountry(countries[0]);
      }
      
      renderCountriesList();
  } catch (error) {
      console.error('Error fetching countries:', error);
      useFallbackCountries();
  }
}

// Fallback data in case API fails
function useFallbackCountries() {
  countries = [
      { name: "India", code: "IN", dialCode: "+91", flag: "https://flagcdn.com/in.svg" },
      { name: "Nigeria", code: "NG", dialCode: "+234", flag: "https://flagcdn.com/ng.svg" },
      { name: "Germany", code: "DE", dialCode: "+49", flag: "https://flagcdn.com/de.svg" },
      { name: "Kenya", code: "KE", dialCode: "+254", flag: "https://flagcdn.com/ke.svg" },
      { name: "South Africa", code: "ZA", dialCode: "+27", flag: "https://flagcdn.com/za.svg" },
      { name: "Georgia", code: "GE", dialCode: "+995", flag: "https://flagcdn.com/ge.svg" },
      { name: "United States", code: "US", dialCode: "+1", flag: "https://flagcdn.com/us.svg" }
  ];
  
  setSelectedCountry(countries[0]); // Set Nigeria as default
  renderCountriesList();
}

// Set the selected country
function setSelectedCountry(country) {
  selectedCountry = country;
  selectedFlag.innerHTML = `<img src="${country.flag}" alt="${country.name}" class="w-full h-full object-cover">`;
  selectedDialCode.textContent = country.dialCode;
}

// Render countries list for dropdown
function renderCountriesList(searchTerm = '') {
  countriesList.innerHTML = '';
  
  const filteredCountries = searchTerm 
      ? countries.filter(c => 
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          c.dialCode.includes(searchTerm))
      : countries;
  
  filteredCountries.forEach(country => {
      const isSelected = selectedCountry && selectedCountry.code === country.code;
      
      const countryItem = document.createElement('div');
      countryItem.className = `flex items-center justify-between p-3 cursor-pointer ${isSelected ? 'country-selected' : 'hover-highlight'}`;
      
      countryItem.innerHTML = `
          <div class="flex items-center">
              <img src="${country.flag}" alt="${country.name}" class="w-8 h-6 mr-3 object-cover">
              <span class="text-gray-700">${country.name} (${country.dialCode})</span>
          </div>
          ${isSelected ? '<i class="ri-check-line text-blue-600"></i>' : ''}
      `;
      
      // Add cursor indicator for Kenya as shown in the image
      if (country.code === 'KE') {
          countryItem.innerHTML += `
              <div class="absolute right-10">
                  <i class="ri-cursor-fill text-gray-400"></i>
              </div>
          `;
      }
      
      countryItem.addEventListener('click', () => {
          setSelectedCountry(country);
          toggleDropdown();
      });
      
      countriesList.appendChild(countryItem);
  });
}

// Toggle dropdown visibility
function toggleDropdown() {
  const isVisible = !countryDropdown.classList.contains('hidden');
  
  if (isVisible) {
      countryDropdown.classList.add('hidden');
  } else {
      countryDropdown.classList.remove('hidden');
      searchInput.value = '';
      renderCountriesList();
      searchInput.focus();
  }
}

// Phone number validation
function validatePhoneNumber(numberInput, countryCode) {
  if (!numberInput)
    return toast.error("Error","Phone number is empty.");

  if (!countryCode)
    return toast.error("Error","No country selected for validation.");

  try {
    const phoneNumber = libphonenumber.parsePhoneNumberFromString(numberInput, countryCode);

    if (!phoneNumber.isValid())
        return false

  return true
    
} catch (error) {
    toast.error("Error", "Error parsing phone number")
    console.error("Error parsing phone number:", error);
}
}

// Event Listeners
countrySelector.addEventListener('click', toggleDropdown);

searchInput.addEventListener('input', (e) => {
  renderCountriesList(e.target.value);
});


// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (!countrySelector.contains(e.target) && 
      !countryDropdown.contains(e.target)) {
      countryDropdown.classList.add('hidden');
  }
});


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

  if(!validatePhoneNumber(phoneInput.value, selectedCountry.code))
    return toast.error('Error', "Please enter a valid mobile number.")

  if(!isStrongPassword(passwordInput.value))
    return toast.error('Error', "Use 8+ characters: include uppercase, lowercase, numbers, and symbols.")

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