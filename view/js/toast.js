// Create a Notyf instance
const toast = new Notyf({
  duration: 3000,
  position: {
      x: 'right',
      y: 'top',
  },
  types: [
      {
          type: 'success',
          background: '#4F46E5',
          icon: {
              className: 'ri-check-line',
              tagName: 'i',
              color: 'white'
          }
      },
      {
          type: 'error',
          background: '#EF4444',
          icon: {
              className: 'ri-error-warning-line',
              tagName: 'i',
              color: 'white'
          }
      }
  ]
});