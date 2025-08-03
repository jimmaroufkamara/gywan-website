// GYWAN Website Main JavaScript

document.addEventListener("DOMContentLoaded", () => {
  // Initialize all functionality
  initializeNavigation()
  initializeScrollEffects()
  initializeAnimations()
  initializeBackToTop()
  initializeForms()
  initializeNewsletter()
  hideLoadingScreen()
})

// Hide loading screen
function hideLoadingScreen() {
  setTimeout(() => {
    const loadingScreen = document.getElementById("loading-screen")
    if (loadingScreen) {
      loadingScreen.style.opacity = "0"
      setTimeout(() => {
        loadingScreen.style.display = "none"
      }, 500)
    }
  }, 1000)
}

// Navigation functionality
function initializeNavigation() {
  const navbar = document.getElementById("navbar")
  const mobileToggle = document.getElementById("mobile-menu-toggle")
  const navMenu = document.getElementById("nav-menu")

  // Navbar scroll effect
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled")
    } else {
      navbar.classList.remove("scrolled")
    }
  })

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener("click", () => {
      mobileToggle.classList.toggle("active")
      navMenu.classList.toggle("active")
      document.body.style.overflow = navMenu.classList.contains("active") ? "hidden" : ""
    })

    // Close mobile menu when clicking on links
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        mobileToggle.classList.remove("active")
        navMenu.classList.remove("active")
        document.body.style.overflow = ""
      })
    })
  }

  // Close mobile menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!navbar.contains(e.target)) {
      mobileToggle?.classList.remove("active")
      navMenu?.classList.remove("active")
      document.body.style.overflow = ""
    }
  })
}

// Scroll effects
function initializeScrollEffects() {
  // Scroll progress indicator
  const scrollIndicator = document.querySelector(".scroll-indicator")

  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset
    const docHeight = document.body.scrollHeight - window.innerHeight
    const scrollPercent = (scrollTop / docHeight) * 100

    if (scrollIndicator) {
      scrollIndicator.style.width = scrollPercent + "%"
    }
  })

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })
}

// Animation effects
function initializeAnimations() {
  // Intersection Observer for fade-in animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible")
      }
    })
  }, observerOptions)

  // Observe all elements with fade-in class
  document.querySelectorAll(".fade-in").forEach((el) => {
    observer.observe(el)
  })

  // Counter animations
  const counters = document.querySelectorAll(".stat-number[data-target]")
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target)
        counterObserver.unobserve(entry.target)
      }
    })
  }, observerOptions)

  counters.forEach((counter) => {
    counterObserver.observe(counter)
  })
}

// Animate counter numbers
function animateCounter(element) {
  const target = Number.parseInt(element.getAttribute("data-target"))
  const duration = 2000 // 2 seconds
  const increment = target / (duration / 16) // 60fps
  let current = 0

  const timer = setInterval(() => {
    current += increment
    if (current >= target) {
      element.textContent = target.toLocaleString()
      clearInterval(timer)
    } else {
      element.textContent = Math.floor(current).toLocaleString()
    }
  }, 16)
}

// Back to top functionality
function initializeBackToTop() {
  const backToTopBtn = document.getElementById("back-to-top")

  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add("show")
      } else {
        backToTopBtn.classList.remove("show")
      }
    })

    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    })
  }
}

// Form enhancements
function initializeForms() {
  // Add loading states to form submissions
  document.querySelectorAll("form").forEach((form) => {
    form.addEventListener("submit", (e) => {
      const submitBtn = form.querySelector('button[type="submit"]')
      if (submitBtn && !submitBtn.disabled) {
        const originalText = submitBtn.innerHTML
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...'
        submitBtn.disabled = true

        // Re-enable after 3 seconds if still processing
        setTimeout(() => {
          if (submitBtn.disabled) {
            submitBtn.innerHTML = originalText
            submitBtn.disabled = false
          }
        }, 3000)
      }
    })
  })

  // Enhanced form validation
  document.querySelectorAll("input[required], textarea[required]").forEach((field) => {
    field.addEventListener("blur", validateField)
    field.addEventListener("input", clearFieldError)
  })
}

// Field validation
function validateField(e) {
  const field = e.target
  const value = field.value.trim()

  // Remove existing error
  clearFieldError(e)

  if (!value) {
    showFieldError(field, "This field is required.")
    return false
  }

  if (field.type === "email" && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      showFieldError(field, "Please enter a valid email address.")
      return false
    }
  }

  return true
}

// Show field error
function showFieldError(field, message) {
  field.classList.add("error")

  let errorElement = field.parentNode.querySelector(".error-message")
  if (!errorElement) {
    errorElement = document.createElement("div")
    errorElement.className = "error-message"
    field.parentNode.appendChild(errorElement)
  }

  errorElement.textContent = message
}

// Clear field error
function clearFieldError(e) {
  const field = e.target
  field.classList.remove("error")

  const errorElement = field.parentNode.querySelector(".error-message")
  if (errorElement) {
    errorElement.remove()
  }
}

// Newsletter subscription
function initializeNewsletter() {
  const newsletterForm = document.getElementById("newsletter-form")

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", async function (e) {
      e.preventDefault()

      const formData = new FormData(this)
      const submitBtn = this.querySelector('button[type="submit"]')
      const originalHTML = submitBtn.innerHTML

      try {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'
        submitBtn.disabled = true

        const response = await fetch("/newsletter-subscribe/", {
          method: "POST",
          body: formData,
          headers: {
            "X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]").value,
          },
        })

        const data = await response.json()

        if (data.success) {
          showMessage("success", data.message || "Thank you for subscribing!")
          this.reset()
        } else {
          showMessage("error", "Subscription failed. Please try again.")
        }
      } catch (error) {
        console.error("Newsletter subscription error:", error)
        showMessage("error", "Network error. Please try again.")
      } finally {
        submitBtn.innerHTML = originalHTML
        submitBtn.disabled = false
      }
    })
  }
}

// Show notification message
function showMessage(type, message) {
  const messageContainer = document.createElement("div")
  messageContainer.className = `alert alert-${type}`
  messageContainer.innerHTML = `
        <i class="fas fa-${type === "success" ? "check-circle" : "exclamation-circle"}"></i>
        ${message}
        <button class="alert-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `

  const messagesContainer = document.querySelector(".messages-container") || createMessagesContainer()
  messagesContainer.appendChild(messageContainer)

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (messageContainer.parentNode) {
      messageContainer.remove()
    }
  }, 5000)
}

// Create messages container if it doesn't exist
function createMessagesContainer() {
  const container = document.createElement("div")
  container.className = "messages-container"
  document.body.appendChild(container)
  return container
}

// Utility functions
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

function throttle(func, delay) {
  let timeoutId
  let lastExecTime = 0
  return function (...args) {
    const currentTime = Date.now()

    if (currentTime - lastExecTime > delay) {
      func.apply(this, args)
      lastExecTime = currentTime
    } else {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(
        () => {
          func.apply(this, args)
          lastExecTime = Date.now()
        },
        delay - (currentTime - lastExecTime),
      )
    }
  }
}

// Performance optimization: throttle scroll events
const throttledScrollHandler = throttle(() => {
  // Handle scroll events here if needed
}, 16) // ~60fps

window.addEventListener("scroll", throttledScrollHandler)

// Add CSS error styles
const errorCSS = `
    .form-group input.error,
    .form-group textarea.error {
        border-color: #dc3545;
        box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
    }
    
    .error-message {
        color: #dc3545;
        font-size: 0.875rem;
        margin-top: 0.25rem;
    }
`

const styleElement = document.createElement("style")
styleElement.textContent = errorCSS
document.head.appendChild(styleElement)
