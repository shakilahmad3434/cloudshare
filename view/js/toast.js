class ModernToast {
    constructor(options = {}) {
      this.options = {
        duration: 5000,
        position: 'right-top',
        ...options
      };
      
      // Create container if it doesn't exist
      this.container = document.querySelector('.modern-toast-container');
      if (!this.container) {
        this.container = document.createElement('div');
        this.container.className = 'modern-toast-container';
        document.body.appendChild(this.container);
      }
    }
    
    // Toast icons
    static icons = {
      success: '✓',
      error: '✕',
      info: 'i',
      warning: '!'
    };
    
    // Show a toast notification
    show(type, title, message) {
      const id = 'toast-' + Date.now();
      
      // Create toast element
      const toast = document.createElement('div');
      toast.id = id;
      toast.className = `modern-toast modern-toast-${type}`;
      
      // Create toast HTML
      toast.innerHTML = `
        <div class="modern-toast-bar"></div>
        <div class="modern-toast-content">
          <div class="modern-toast-icon">
            ${ModernToast.icons[type]}
          </div>
          <div class="modern-toast-text">
            <div class="modern-toast-title">${title}</div>
            <div class="modern-toast-message">${message}</div>
          </div>
        </div>
        <button class="modern-toast-close">×</button>
        <div class="modern-toast-progress"></div>
      `;
      
      // Add close button event listener
      toast.querySelector('.modern-toast-close').addEventListener('click', () => {
        this.dismiss(id);
      });
      
      // Add progress bar animation
      const progressBar = toast.querySelector('.modern-toast-progress');
      progressBar.style.animation = `toast-progress ${this.options.duration / 1000}s linear forwards`;
      
      // Add toast to container
      this.container.appendChild(toast);
      
      // Auto-dismiss after duration
      setTimeout(() => {
        this.dismiss(id);
      }, this.options.duration);
      
      return id;
    }
    
    // Show different toast types
    success(title, message) {
      return this.show('success', title, message);
    }
    
    error(title, message) {
      return this.show('error', title, message);
    }
    
    info(title, message) {
      return this.show('info', title, message);
    }
    
    warning(title, message) {
      return this.show('warning', title, message);
    }
    
    // Dismiss a toast by ID
    dismiss(id) {
      const toast = document.getElementById(id);
      if (!toast) return;
      
      toast.classList.add('modern-toast-exit');
      
      toast.addEventListener('animationend', function(e) {
        if (e.animationName === 'toast-slide-out') {
          toast.remove();
        }
      });
    }
  }
  
  // Create a global toast instance
  const toast = new ModernToast();