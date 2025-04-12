document.addEventListener('DOMContentLoaded', function() {
  const menuButton = document.querySelector('.mobile-menu-button');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  menuButton.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
      
      // Change icon based on menu state
      const menuIcon = menuButton.querySelector('i');
      if (mobileMenu.classList.contains('hidden')) {
          menuIcon.classList.remove('ri-close-line');
          menuIcon.classList.add('ri-menu-line');
      } else {
          menuIcon.classList.remove('ri-menu-line');
          menuIcon.classList.add('ri-close-line');
      }
  });

  const faqButtons = document.querySelectorAll('.faq-button');
      
  faqButtons.forEach(button => {
    button.addEventListener('click', function() {
      const content = this.nextElementSibling;
      const icon = this.querySelector('i');
      const faqItem = this.parentElement;
      
      // Close all other FAQs
      faqButtons.forEach(otherButton => {
        if (otherButton !== button) {
          const otherContent = otherButton.nextElementSibling;
          const otherIcon = otherButton.querySelector('i');
          const otherFaqItem = otherButton.parentElement;
          
          otherContent.classList.add('hidden');
          otherIcon.classList.remove('ri-subtract-line', 'transform', 'rotate-180');
          otherIcon.classList.add('ri-add-line');
          otherFaqItem.classList.remove('ring-2', 'ring-blue-500', 'border-blue-500');
        }
      });
      
      // Toggle current FAQ
      if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        icon.classList.remove('ri-add-line');
        icon.classList.add('ri-subtract-line', 'transform', 'rotate-180');
        faqItem.classList.add('ring-2', 'ring-blue-500', 'border-blue-500');
      } else {
        content.classList.add('hidden');
        icon.classList.remove('ri-subtract-line', 'transform', 'rotate-180');
        icon.classList.add('ri-add-line');
        faqItem.classList.remove('ring-2', 'ring-blue-500', 'border-blue-500');
      }
    });
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
          e.preventDefault();
          const targetId = this.getAttribute('href');
          if (targetId === '#') return;
          
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
              targetElement.scrollIntoView({
                  behavior: 'smooth'
              });
          }
          
          // Close mobile menu if open
          if (!mobileMenu.classList.contains('hidden')) {
              mobileMenu.classList.add('hidden');
              const menuIcon = menuButton.querySelector('i');
              menuIcon.classList.remove('ri-close-line');
              menuIcon.classList.add('ri-menu-line');
          }
      });
  });
});

