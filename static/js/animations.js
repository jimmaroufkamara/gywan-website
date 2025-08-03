// Advanced Animation Effects for GYWAN Website

document.addEventListener("DOMContentLoaded", () => {
  console.log('[GYWAN] animations.js loaded and running on this page');
  initializeAdvancedAnimations()
  initializeHoverEffects()
  initializeScrollAnimations()

  // Last-resort: If on index page, force all .scroll-reveal to be visible after 3s
  if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
    setTimeout(() => {
      document.querySelectorAll('.scroll-reveal').forEach(el => {
        el.classList.add('revealed')
        el.style.opacity = '1';
        el.style.transform = 'none';
      })
      console.log('[GYWAN] Forced .scroll-reveal visible on index page');
    }, 3000);
  }
})

function initializeAdvancedAnimations() {
  // Staggered animations for grids
  animateGridItems()

  // Typewriter effect for hero title
  initializeTypewriter()

  // Floating particles animation
  createFloatingParticles()

  // Progress bars animation
  animateProgressBars()
}

function animateGridItems() {
  const grids = document.querySelectorAll(".mission-grid, .values-grid, .events-grid, .stories-grid")

  grids.forEach((grid) => {
    const items = grid.querySelectorAll(".mission-item, .value-card, .event-card, .story-card")

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const items = entry.target.children
            Array.from(items).forEach((item, index) => {
              setTimeout(() => {
                item.style.opacity = "1"
                item.style.transform = "translateY(0)"
              }, index * 100)
            })
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 },
    )

    // Prepare items for animation
    Array.from(items).forEach((item) => {
      item.style.opacity = "0"
      item.style.transform = "translateY(30px)"
      item.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
    })

    observer.observe(grid)
  })
}

function initializeTypewriter() {
  const typewriterElements = document.querySelectorAll(".typewriter")

  typewriterElements.forEach((element) => {
    const text = element.textContent
    element.textContent = ""
    element.style.borderRight = "2px solid var(--primary-color)"
    element.style.whiteSpace = "nowrap"
    element.style.overflow = "hidden"

    let index = 0
    const timer = setInterval(() => {
      element.textContent = text.slice(0, index)
      index++

      if (index > text.length) {
        clearInterval(timer)
        setTimeout(() => {
          element.style.borderRight = "none"
        }, 500)
      }
    }, 100)
  })
}

function createFloatingParticles() {
  const heroParticles = document.querySelector(".hero-particles")
  if (!heroParticles) return

  // Create floating elements
  for (let i = 0; i < 6; i++) {
    const particle = document.createElement("div")
    particle.className = "floating-particle"
    particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 20 + 10}px;
            height: ${Math.random() * 20 + 10}px;
            background: rgba(233, 30, 99, 0.1);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float-${i} ${6 + Math.random() * 4}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
        `

    // Create unique float animation for each particle
    const floatKeyframes = `
            @keyframes float-${i} {
                0%, 100% {
                    transform: translateY(0px) rotate(0deg);
                    opacity: 0.3;
                }
                50% {
                    transform: translateY(-${20 + Math.random() * 20}px) rotate(180deg);
                    opacity: 0.8;
                }
            }
        `

    // Add keyframes to stylesheet
    if (!document.querySelector(`#float-keyframes-${i}`)) {
      const style = document.createElement("style")
      style.id = `float-keyframes-${i}`
      style.textContent = floatKeyframes
      document.head.appendChild(style)
    }

    heroParticles.appendChild(particle)
  }
}

function animateProgressBars() {
  const progressBars = document.querySelectorAll(".progress-bar")

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const progressBar = entry.target
          const percentage = progressBar.dataset.percentage || 0

          progressBar.style.width = "0%"
          progressBar.style.transition = "width 2s ease-in-out"

          setTimeout(() => {
            progressBar.style.width = percentage + "%"
          }, 200)

          observer.unobserve(progressBar)
        }
      })
    },
    { threshold: 0.5 },
  )

  progressBars.forEach((bar) => observer.observe(bar))
}

function initializeHoverEffects() {
  // Card tilt effect
  addCardTiltEffect()

  // Button ripple effect
  addButtonRippleEffect()

  // Image parallax on hover
  addImageParallax()
}

function addCardTiltEffect() {
  const cards = document.querySelectorAll(".mission-item, .value-card, .event-card, .story-card")

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const centerX = rect.width / 2
      const centerY = rect.height / 2

      const rotateX = (y - centerY) / 10
      const rotateY = (centerX - x) / 10

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
    })

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)"
    })

    // Ensure smooth transitions
    card.style.transition = "transform 0.1s ease-out"
  })
}

function addButtonRippleEffect() {
  const buttons = document.querySelectorAll(".btn")

  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      const ripple = document.createElement("span")
      const rect = this.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = e.clientX - rect.left - size / 2
      const y = e.clientY - rect.top - size / 2

      ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `

      this.style.position = "relative"
      this.style.overflow = "hidden"
      this.appendChild(ripple)

      setTimeout(() => {
        ripple.remove()
      }, 600)
    })
  })

  // Add ripple animation keyframes
  if (!document.querySelector("#ripple-keyframes")) {
    const style = document.createElement("style")
    style.id = "ripple-keyframes"
    style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `
    document.head.appendChild(style)
  }
}

function addImageParallax() {
  const images = document.querySelectorAll(".event-image img, .story-image img")

  images.forEach((img) => {
    const container = img.parentElement

    container.addEventListener("mousemove", (e) => {
      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const moveX = (x - rect.width / 2) * 0.05
      const moveY = (y - rect.height / 2) * 0.05

      img.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.1)`
    })

    container.addEventListener("mouseleave", () => {
      img.style.transform = "translate(0, 0) scale(1.05)"
    })

    img.style.transition = "transform 0.3s ease-out"
  })
}

function initializeScrollAnimations() {
  // Parallax scrolling effects
  addParallaxScrolling()

  // Reveal animations on scroll
  addScrollRevealAnimations()

  // Number counting on scroll
  addScrollCounters()
}

function addParallaxScrolling() {
  const parallaxElements = document.querySelectorAll(".hero-background")

  window.addEventListener(
    "scroll",
    throttle(() => {
      const scrollTop = window.pageYOffset

      parallaxElements.forEach((element) => {
        const speed = 0.5
        element.style.transform = `translateY(${scrollTop * speed}px)`
      })
    }, 16),
  )
}

function addScrollRevealAnimations() {
  const revealElements = document.querySelectorAll(".scroll-reveal")
  console.log("[scroll-reveal] Found elements:", revealElements.length)

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed")
          console.log("[scroll-reveal] Revealed:", entry.target)
          observer.unobserve(entry.target)
        }
      })
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    },
  )

  revealElements.forEach((element) => {
    element.style.opacity = "0"
    element.style.transform = "translateY(50px)"
    element.style.transition = "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)"
    observer.observe(element)
  })

  // Add revealed state styles
  if (!document.querySelector("#scroll-reveal-styles")) {
    const style = document.createElement("style")
    style.id = "scroll-reveal-styles"
    style.textContent = `
            .scroll-reveal.revealed {
                opacity: 1;
                transform: translateY(0);
            }
        `
    document.head.appendChild(style)
  }

  // Fallback: If JS runs but IntersectionObserver fails, reveal all after DOMContentLoaded
  setTimeout(() => {
    document.querySelectorAll('.scroll-reveal').forEach(el => {
      if (!el.classList.contains('revealed')) {
        el.classList.add('revealed')
        console.log('[scroll-reveal] Fallback revealed:', el)
      }
    })
  }, 2000)
}

function addScrollCounters() {
  const counters = document.querySelectorAll(".scroll-counter")

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const counter = entry.target
          const target = Number.parseInt(counter.dataset.target)
          const duration = Number.parseInt(counter.dataset.duration) || 2000

          animateValue(counter, 0, target, duration)
          observer.unobserve(counter)
        }
      })
    },
    { threshold: 0.5 },
  )

  counters.forEach((counter) => observer.observe(counter))
}

function animateValue(element, start, end, duration) {
  const startTime = performance.now()

  function update(currentTime) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)

    // Easing function (ease-out)
    const easeOut = 1 - Math.pow(1 - progress, 3)
    const current = Math.floor(start + (end - start) * easeOut)

    element.textContent = current.toLocaleString()

    if (progress < 1) {
      requestAnimationFrame(update)
    }
  }

  requestAnimationFrame(update)
}

// Utility function for throttling
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
