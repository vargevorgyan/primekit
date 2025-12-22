const menuToggle = document.querySelector('.menu-toggle')
const mobileMenu = document.querySelector('.mobile-menu')
const menuClose = document.querySelector('.menu-close')
const mobileNavLinks = document.querySelectorAll('.mobile-nav a')

// Open Menu
if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    mobileMenu.classList.add('is-open')
    document.body.style.overflow = 'hidden' // Prevent scrolling when menu is open
  })
}

// Close Menu
if (menuClose && mobileMenu) {
  menuClose.addEventListener('click', () => {
    mobileMenu.classList.remove('is-open')
    document.body.style.overflow = ''
  })
}

// Close Menu when clicking a link
if (mobileNavLinks) {
  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (mobileMenu) {
        mobileMenu.classList.remove('is-open')
        document.body.style.overflow = ''
      }
    })
  })
}

// --- Viewport Height Correction ---
// Used to fix 100vh issue on mobile browsers where address bar hides content
function setVh() {
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}

setVh()
window.addEventListener('resize', setVh)

// --- Modal Logic ---

const modal = document.getElementById('contact-modal')
const openModalBtns = document.querySelectorAll('.js-open-modal')
const closeModalElements = document.querySelectorAll('[data-close]')

// Open Modal
if (openModalBtns) {
  openModalBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault()
      if (modal) {
        modal.classList.add('is-open')
        document.body.style.overflow = 'hidden'
      }
      // Close mobile menu if open
      if (mobileMenu && mobileMenu.classList.contains('is-open')) {
        mobileMenu.classList.remove('is-open')
      }
    })
  })
}

// Close Modal
function closeModal() {
  if (modal) {
    modal.classList.remove('is-open')
    // Only reset overflow if mobile menu is not open
    if (!mobileMenu || !mobileMenu.classList.contains('is-open')) {
      document.body.style.overflow = ''
    }
  }
}

if (closeModalElements) {
  closeModalElements.forEach((el) => {
    el.addEventListener('click', closeModal)
  })
}

// Close on Esc
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) {
    closeModal()
  }
})

// --- Phone Mask ---
const phoneInputs = document.querySelectorAll('input[type="tel"]')

phoneInputs.forEach((phoneInput) => {
  phoneInput.addEventListener('input', function (e) {
    let x = e.target.value
      .replace(/\D/g, '')
      .match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/)
    if (!x[2] && x[1] !== '') {
      e.target.value = x[1] === '8' ? x[1] : '+7' + x[1]
    } else {
      e.target.value = !x[2]
        ? x[1]
        : '+7 (' +
          x[2] +
          (x[3] ? ') ' + x[3] : '') +
          (x[4] ? '-' + x[4] : '') +
          (x[5] ? '-' + x[5] : '')
    }
  })
})

// --- Form Validation ---
const forms = document.querySelectorAll('form')

forms.forEach((form) => {
  form.addEventListener('submit', function (e) {
    e.preventDefault()
    let isValid = true
    const errorMessage = form.querySelector('.form-error-message')

    // Reset errors
    const formGroups = form.querySelectorAll('.form-group')
    formGroups.forEach((group) => group.classList.remove('error'))
    if (errorMessage) errorMessage.classList.remove('visible')

    // Validate Required Inputs
    const requiredInputs = form.querySelectorAll('input[required]')
    requiredInputs.forEach((input) => {
      // Checkbox check
      if (input.type === 'checkbox') {
        if (!input.checked) {
          isValid = false
          // Assuming checkbox is inside a label or div, we might want to highlight it
          // But design usually relies on border.
          // If checkbox is wrapped in .pink-checkbox, we might want to add error class to it.
          // Current generic error handling targets .form-group.
          // Let's see if we can add error to parent label or container.
          const parent =
            input.closest('.pink-checkbox') ||
            input.closest('.form-checkbox') ||
            input.closest('.form-group')
          if (parent) parent.classList.add('error') // Need styles for this if desired
        }
      } else {
        if (!input.value.trim()) {
          isValid = false
          const group = input.closest('.form-group')
          if (group) group.classList.add('error')
        }
      }
    })

    // Validate Phone(s)
    const formPhoneInputs = form.querySelectorAll('input[type="tel"]')
    formPhoneInputs.forEach((input) => {
      if (input.value.trim()) {
        const phoneDigits = input.value.replace(/\D/g, '')
        if (phoneDigits.length < 11) {
          isValid = false
          const group = input.closest('.form-group')
          if (group) group.classList.add('error')
        }
      }
    })

    // Validate Email(s)
    const formEmailInputs = form.querySelectorAll('input[type="email"]')
    formEmailInputs.forEach((input) => {
      if (input.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(input.value.trim())) {
          isValid = false
          const group = input.closest('.form-group')
          if (group) group.classList.add('error')
        }
      }
    })

    if (!isValid) {
      if (errorMessage) errorMessage.classList.add('visible')
    } else {
      // Submit form (simulate)
      alert('Форма отправлена!')
      form.reset()
      // If it's the modal form, close it
      if (form.closest('.modal')) {
        closeModal()
      }
    }
  })

  // Clear error on input
  const inputs = form.querySelectorAll('input, textarea')
  inputs.forEach((input) => {
    input.addEventListener('input', function () {
      const group = this.closest('.form-group')
      if (group) group.classList.remove('error')
      const errorMessage = form.querySelector('.form-error-message')
      if (errorMessage) errorMessage.classList.remove('visible')

      const checkboxParent = this.closest('.pink-checkbox')
      if (checkboxParent) checkboxParent.classList.remove('error')
    })
  })
})

// --- Custom Dropdown Logic ---
const selects = document.querySelectorAll('.select')

selects.forEach((select) => {
  const trigger = select.querySelector('.select-trigger')
  const options = select.querySelectorAll('.select-options li')
  const input = select.querySelector('input[type="hidden"]')

  if (trigger) {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation()
      // Close other selects
      selects.forEach((s) => {
        if (s !== select) s.classList.remove('open')
      })
      select.classList.toggle('open')
    })
  }

  options.forEach((option) => {
    option.addEventListener('click', (e) => {
      e.stopPropagation()
      const value = option.getAttribute('data-value')
      const text = option.textContent

      if (input) input.value = value
      if (trigger) trigger.textContent = text

      select.classList.remove('open')
    })
  })
})

// Close dropdowns when clicking outside
document.addEventListener('click', () => {
  selects.forEach((select) => {
    select.classList.remove('open')
  })
})

// --- Sticky Header Blur Effect ---
const navbar = document.querySelector('.navbar')

let lastScrollY = window.scrollY
let isHeaderHidden = false

function handleScroll() {
  const currentScrollY = window.scrollY

  // Handle hide/show header logic
  if (currentScrollY > lastScrollY && currentScrollY > 100) {
    // Scrolling down - hide header
    if (!isHeaderHidden) {
      navbar.classList.add('navbar--hidden')
      navbar.classList.remove('navbar--white')
      isHeaderHidden = true
    }
  } else if (currentScrollY < lastScrollY) {
    // Scrolling up - show header
    if (isHeaderHidden) {
      navbar.classList.remove('navbar--hidden')
      // Add white background only if we're not at the very top
      if (currentScrollY > 50) {
        navbar.classList.add('navbar--white')
      } else {
        navbar.classList.remove('navbar--white')
      }
      isHeaderHidden = false
    }
  }

  // Always remove white background when at the very top
  if (currentScrollY <= 50 && !isHeaderHidden) {
    navbar.classList.remove('navbar--white')
  }

  lastScrollY = currentScrollY
}

// Initial check - ensure header is visible without white background at the top
navbar.classList.remove('navbar--hidden', 'navbar--white')
handleScroll()

// Listen for scroll events
window.addEventListener('scroll', handleScroll)

// --- Stats Slider ---
;(() => {
  const slider = document.getElementById('stats-slider')
  if (!slider) return

  const slides = Array.from(slider.querySelectorAll('.stats-slide'))
  const dots = Array.from(slider.querySelectorAll('.stats-timeline-dot'))
  const delay = 4000
  let current = 0
  let timerId

  const applyStates = (index) => {
    const prev = (index - 1 + slides.length) % slides.length
    const next = (index + 1) % slides.length

    slides.forEach((slide, i) => {
      slide.classList.remove('state-current', 'state-prev', 'state-next')
      if (i === index) {
        slide.classList.add('state-current')
      } else if (i === prev) {
        slide.classList.add('state-prev')
      } else if (i === next) {
        slide.classList.add('state-next')
      }
    })

    updateProgress(index)
    current = index
  }

  const updateProgress = (index) => {
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index)
      dot.classList.remove('progress')
      if (i < index) {
        dot.classList.add('prev')
      } else dot.classList.remove('prev')
      if (i === index) {
        dot.style.setProperty('--progress-duration', `${delay}ms`)
        void dot.offsetWidth
        dot.classList.add('progress')
      }
    })
  }

  const goTo = (index) => {
    const nextIndex = (index + slides.length) % slides.length
    applyStates(nextIndex)
  }
  const startAutoplay = () => {
    clearInterval(timerId)
    timerId = setInterval(() => goTo(current + 1), delay)
  }

  slides.forEach((slide) => {
    slide.addEventListener('click', (event) => {
      const bounds = slide.getBoundingClientRect()
      const clickX = event.clientX - bounds.left
      const isLeft = clickX < bounds.width / 2
      goTo(current + (isLeft ? -1 : 1))
      startAutoplay()
    })
  })

  dots.forEach((dot) => {
    dot.addEventListener('click', (event) => {
      const targetIndex = Number(event.currentTarget.dataset.index)
      goTo(targetIndex)
      startAutoplay()
    })
  })

  const arrowLeft = slider.querySelector('.stats-slider-arrow-left')
  const arrowRight = slider.querySelector('.stats-slider-arrow-right')

  if (arrowLeft) {
    arrowLeft.addEventListener('click', () => {
      goTo(current - 1)
      startAutoplay()
    })
  }

  if (arrowRight) {
    arrowRight.addEventListener('click', () => {
      goTo(current + 1)
      startAutoplay()
    })
  }

  applyStates(0)
  startAutoplay()
})()

// --- Portfolio Slider ---
;(() => {
  const slidesEl = document.getElementById('portfolioSlides')
  if (!slidesEl) return

  const slides = slidesEl.children

  const infoIndex = document.getElementById('portfolioInfoIndex')
  const infoTitle = document.getElementById('portfolioInfoTitle')
  const infoSub = document.getElementById('portfolioInfoSub')

  const prevBtn = document.getElementById('portfolioPrevBtn')
  const nextBtn = document.getElementById('portfolioNextBtn')

  const progressBar = document.getElementById('portfolioProgressBar')

  let currentIndex = 0
  const totalSlides = slides.length
  const slideDuration = 4000
  let animationFrame

  // Make currentIndex accessible to other parts of the code
  window.currentPortfolioIndex = currentIndex

  function updateSlider() {
    slidesEl.style.transform = `translateX(-${currentIndex * 100}%)`

    const slide = slides[currentIndex]
    if (infoIndex) infoIndex.innerText = slide.dataset.index
    if (infoTitle) infoTitle.innerText = slide.dataset.title
    if (infoSub) infoSub.innerText = slide.dataset.sub

    // Update global current portfolio index
    window.currentPortfolioIndex = currentIndex

    startProgress()
  }

  function startProgress() {
    cancelAnimationFrame(animationFrame)
    if (progressBar) progressBar.style.width = '0%'
    let start = null

    function animate(timestamp) {
      if (!start) start = timestamp
      const elapsed = timestamp - start
      const percent = Math.min((elapsed / slideDuration) * 100, 100)
      if (progressBar) progressBar.style.width = percent + '%'
      if (elapsed < slideDuration) {
        animationFrame = requestAnimationFrame(animate)
      } else {
        nextSlide()
      }
    }
    animationFrame = requestAnimationFrame(animate)
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides
    updateSlider()
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides
    updateSlider()
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide()
    })
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide()
    })
  }

  // initialize
  updateSlider()
})()

// --- FAQ Accordion ---
;(() => {
  document.querySelectorAll('.working-faq-question').forEach((item) => {
    const question = item.querySelector('.working-question')
    const iconImg = item.querySelector('.working-question-icon img')

    question.addEventListener('click', () => {
      // закрыть остальные
      document.querySelectorAll('.working-faq-question').forEach((el) => {
        if (el !== item) {
          el.classList.remove('working-active')
          const otherIcon = el.querySelector('.working-question-icon img')
          if (otherIcon) {
            otherIcon.src = './assets/icon-plus.svg'
            otherIcon.alt = '+'
          }
        }
      })

      // открыть / закрыть текущий
      item.classList.toggle('working-active')
      if (item.classList.contains('working-active')) {
        iconImg.src = './assets/icon-minus.svg'
        iconImg.alt = '-'
      } else {
        iconImg.src = './assets/icon-plus.svg'
        iconImg.alt = '+'
      }
    })
  })
})()

// --- Portfolio Modal Logic ---
;(() => {
  const portfolioModal = document.getElementById('portfolio-modal')
  const portfolioSlides = document.querySelectorAll('.portfolio-slide')
  let currentPortfolioIndex = 0
  let currentImageIndex = 0

  // Function to populate modal with portfolio data
  function populatePortfolioModal(projectIndex, imageIndex = 0) {
    if (!portfolioModal || !portfolioData[projectIndex]) return

    const data = portfolioData[projectIndex]
    currentPortfolioIndex = projectIndex
    currentImageIndex = imageIndex

    // Get the current image from projectImages array or fallback to modalImage
    const currentImage =
      data.projectImages && data.projectImages[imageIndex]
        ? data.projectImages[imageIndex]
        : data.modalImage

    // Update modal image with animation
    const modalImage = portfolioModal.querySelector('.portfolio-modal-image')
    if (modalImage) {
      // Start fade-out animation
      modalImage.classList.add('fade-out')
      modalImage.classList.remove('fade-in')

      // Change image after fade-out completes
      setTimeout(() => {
        modalImage.src = currentImage
        modalImage.alt = data.object

        // Start fade-in animation
        modalImage.classList.remove('fade-out')
        modalImage.classList.add('fade-in')
      }, 150) // Half of the transition duration
    }

    // Update modal details
    const detailItems = portfolioModal.querySelectorAll(
      '.portfolio-detail-item'
    )

    // Object
    const objectItem = detailItems[0]
    if (objectItem) {
      objectItem.querySelector('.portfolio-detail-value').textContent =
        data.object
    }

    // Mest
    const mestItem = detailItems[1]
    if (mestItem) {
      mestItem.querySelector('.portfolio-detail-value').textContent = data.mest
    }

    // Customer
    const customerItem = detailItems[2]
    if (customerItem) {
      customerItem.querySelector('.portfolio-detail-value').textContent =
        data.customer
    }

    // Stage
    const stageItem = detailItems[3]
    if (stageItem) {
      stageItem.querySelector('.portfolio-detail-value').textContent =
        data.stage
    }

    // Work
    const workItem = detailItems[4]
    if (workItem) {
      workItem.querySelector('.portfolio-detail-text').textContent = data.work
    }

    // Address
    const addressItem = detailItems[5]
    if (addressItem) {
      addressItem.querySelector('.portfolio-detail-text').textContent =
        data.address
    }

    // Award
    const awardDiv = portfolioModal.querySelector('.portfolio-award')
    if (awardDiv) {
      if (data.award) {
        awardDiv.style.display = 'flex'
        awardDiv.querySelector('p').textContent = data.award
      } else {
        awardDiv.style.display = 'none'
      }
    }

    // Update navigation buttons
    updateModalNavigationButtons()
  }

  // Add click handlers to portfolio slides - DISABLED per request
  /*
  portfolioSlides.forEach((slide, index) => {
    slide.addEventListener('click', (e) => {
      e.preventDefault()
      populatePortfolioModal(index)
      portfolioModal.classList.add('is-open')
      document.body.style.overflow = 'hidden'

      // Ensure image starts with fade-in class
      const modalImage = portfolioModal.querySelector('.portfolio-modal-image')
      if (modalImage) {
        modalImage.classList.add('fade-in')
      }
    })
  })
  */

  // Handle the old CTA button (if it still exists)
  const portfolioOpenBtn = document.querySelector('.portfolio-cta-icon')
  if (portfolioOpenBtn && portfolioModal) {
    const openPortfolioModal = () => {
      const currentPortfolioIndex = window.currentPortfolioIndex || 0
      populatePortfolioModal(currentPortfolioIndex, 0) // Open modal for current portfolio, start with first image
      portfolioModal.classList.add('is-open')
      document.body.style.overflow = 'hidden'

      // Ensure image starts with fade-in class
      const modalImage = portfolioModal.querySelector('.portfolio-modal-image')
      if (modalImage) {
        modalImage.classList.add('fade-in')
      }
    }

    portfolioOpenBtn.addEventListener('click', (e) => {
      e.preventDefault()
      openPortfolioModal()
    })

    /*
    portfolioOpenBtn.addEventListener('mouseenter', () => {
      if (window.innerWidth >= 1024) {
        openPortfolioModal()
      }
    })
    */

    // Handle "Подробнее" button inside cta content
    const portfolioMoreBtn = document.querySelector('.js-open-portfolio-modal')

    if (portfolioMoreBtn) {
      portfolioMoreBtn.addEventListener('click', (e) => {
        openPortfolioModal()
      })
    }
  }

  // Close Logic
  if (portfolioModal) {
    const closeElements = portfolioModal.querySelectorAll('[data-close]')
    closeElements.forEach((el) => {
      el.addEventListener('click', () => {
        portfolioModal.classList.remove('is-open')
        // Only restore overflow if mobile menu is not open
        const mobileMenu = document.querySelector('.mobile-menu')
        if (!mobileMenu || !mobileMenu.classList.contains('is-open')) {
          document.body.style.overflow = ''
        }
      })
    })

    // Close on Esc
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && portfolioModal.classList.contains('is-open')) {
        portfolioModal.classList.remove('is-open')
        const mobileMenu = document.querySelector('.mobile-menu')
        if (!mobileMenu || !mobileMenu.classList.contains('is-open')) {
          document.body.style.overflow = ''
        }
      }
    })
  }

  // Function to update navigation button states
  function updateModalNavigationButtons() {
    if (!portfolioModal || !portfolioData[currentPortfolioIndex]) return

    const prevBtn = portfolioModal.querySelector('.portfolio-nav-btn.prev')
    const nextBtn = portfolioModal.querySelector('.portfolio-nav-btn.next')
    const projectImages = portfolioData[currentPortfolioIndex].projectImages

    if (!projectImages || projectImages.length <= 1) {
      // If no images or only one image, disable both buttons
      if (prevBtn) {
        prevBtn.classList.add('disabled')
        prevBtn.classList.remove('enabled')
      }
      if (nextBtn) {
        nextBtn.classList.add('disabled')
        nextBtn.classList.remove('enabled')
      }
      return
    }

    // Enable/disable buttons based on current image position
    if (prevBtn) {
      if (currentImageIndex > 0) {
        prevBtn.classList.add('enabled')
        prevBtn.classList.remove('disabled')
      } else {
        prevBtn.classList.add('disabled')
        prevBtn.classList.remove('enabled')
      }
    }

    if (nextBtn) {
      if (currentImageIndex < projectImages.length - 1) {
        nextBtn.classList.add('enabled')
        nextBtn.classList.remove('disabled')
      } else {
        nextBtn.classList.add('disabled')
        nextBtn.classList.remove('enabled')
      }
    }
  }

  // Navigation button click handlers for image navigation within current project
  if (portfolioModal) {
    const prevBtn = portfolioModal.querySelector('.portfolio-nav-btn.prev')
    const nextBtn = portfolioModal.querySelector('.portfolio-nav-btn.next')

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault()
        if (currentImageIndex > 0) {
          populatePortfolioModal(currentPortfolioIndex, currentImageIndex - 1)
        }
      })
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault()
        const projectImages = portfolioData[currentPortfolioIndex].projectImages
        if (projectImages && currentImageIndex < projectImages.length - 1) {
          populatePortfolioModal(currentPortfolioIndex, currentImageIndex + 1)
        }
      })
    }
  }
})()

// --- Portfolio CTA Toggle ---
;(() => {
  const portfolioCta = document.querySelector('.portfolio-top-cta')
  const portfolioContent = document.querySelector('.portfolio-cta-content')
  const portfolioSlides = document.getElementById('portfolioSlides')

  if (portfolioCta && portfolioContent) {
    // Toggle content on click - DISABLED per request
    /*
    portfolioCta.addEventListener('click', (e) => {
      // Prevent the click from bubbling if it's on the icon (which already has modal functionality)
      if (e.target.closest('.portfolio-cta-icon')) return

      portfolioContent.classList.toggle('is-visible')
    })
    */

    // Close content when clicking outside
    document.addEventListener('click', (e) => {
      if (!portfolioCta.contains(e.target)) {
        portfolioContent.classList.remove('is-visible')
      }
    })
  }
})()

// --- Technic Modal Logic ---
;(() => {
  const technicModal = document.getElementById('technic-modal')
  const technicOpenBtns = document.querySelectorAll('.js-open-technic-modal')

  if (technicModal && technicOpenBtns.length > 0) {
    technicOpenBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault()
        technicModal.classList.add('is-open')
        document.body.style.overflow = 'hidden'
      })
    })

    // Close Logic
    const closeElements = technicModal.querySelectorAll('[data-close]')
    closeElements.forEach((el) => {
      el.addEventListener('click', () => {
        technicModal.classList.remove('is-open')
        const mobileMenu = document.querySelector('.mobile-menu')
        if (!mobileMenu || !mobileMenu.classList.contains('is-open')) {
          document.body.style.overflow = ''
        }
      })
    })

    // Close on Esc
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && technicModal.classList.contains('is-open')) {
        technicModal.classList.remove('is-open')
        const mobileMenu = document.querySelector('.mobile-menu')
        if (!mobileMenu || !mobileMenu.classList.contains('is-open')) {
          document.body.style.overflow = ''
        }
      }
    })
  }
})()

// const observer = new IntersectionObserver((entries, {}) => {
//   entries.forEach((entry) => {
//     if (entry.isIntersecting) {
//       document.body.style.height = window.innerHeight + "px";
//       document.body.style.overflow = "hidden"

//       console.log(window.scrollY);
//     }
//   });
// });

// const sliderWrapper = document.querySelector(".slider-wrapper");
// observer.observe(sliderWrapper);
// const sliderSection = document.getElementById("benefits");
// const sliderWrapper = sliderSection.querySelector(".slider-wrapper");
// let scrollPosition = 0;
// let maxTranslate = sliderWrapper.scrollWidth - window.innerWidth;
// let hijackActive = false;

// // Track the original scroll position for restoration
// let bodyScroll = window.scrollY;

// // Listen for wheel scroll
// window.addEventListener(
//   "wheel",
//   (e) => {
//     const sectionTop = sliderSection.offsetTop;
//     const sectionBottom = sectionTop + sliderSection.offsetHeight;

//     if (
//       (window.scrollY >= sectionTop && window.scrollY <= sectionBottom) ||
//       !hijackActive
//     ) {
//       hijackActive = true;
//       e.preventDefault(); // freeze page scroll

//       // Accumulate scroll delta
//       scrollPosition += e.deltaY;
//       scrollPosition = Math.min(Math.max(scrollPosition, 0), maxTranslate);

//       // Move the slider horizontally
//       sliderWrapper.style.transform = `translateX(${-scrollPosition}px)`;

//       // Stop hijack when slider ends
//       if (scrollPosition >= maxTranslate) {
//         hijackActive = false;
//         // allow normal scroll
//         // window.scrollTo(0, bodyScroll);
//       }
//     }
//   },
//   { passive: false }
// );
const sliderSection = document.getElementById('benefits')
const sliderWrapper = sliderSection.querySelector('.slider-wrapper')
const maxTranslate = sliderWrapper.scrollWidth - window.innerWidth
let hijackActive = false

function isSectionInMiddleOfScreen() {
  const rect = sliderSection.getBoundingClientRect()
  const windowHeight = window.innerHeight
  const sectionCenter = rect.top + rect.height / 2
  const viewportCenter = windowHeight / 2

  // Check if section center is within a reasonable range of viewport center
  return Math.abs(sectionCenter - viewportCenter) < windowHeight * 0.4
}

function getCurrentSliderPosition() {
  const transform = window.getComputedStyle(sliderWrapper).transform
  if (transform === 'none') return 0

  // Extract translateX value from matrix
  const matrix = transform.match(/matrix\(([^)]+)\)/)
  if (matrix) {
    const values = matrix[1].split(', ')
    const translateX = parseFloat(values[4])
    // translateX is negative in our case (translateX(-position))
    return Math.abs(translateX)
  }

  return 0
}

// Add position tracking to avoid matrix parsing issues
let sliderPosition = 0

// Update maxTranslate on resize
window.addEventListener('resize', () => {
  if (sliderWrapper && sliderSection) {
    // Assuming sliderSection is the viewport container for the wrapper
    // If not, use window.innerWidth or the actual visible width container
    const containerWidth =
      sliderSection.clientWidth ||
      sliderSection.offsetWidth ||
      window.innerWidth
    maxTranslate = sliderWrapper.scrollWidth - containerWidth
    // Clamp current position
    sliderPosition = Math.max(0, Math.min(sliderPosition, maxTranslate))
    sliderWrapper.style.transform = `translateX(${-sliderPosition}px)`
  }
})

window.addEventListener(
  'wheel',
  (e) => {
    // Only hijack on larger screens
    if (window.innerWidth < 1024) return

    const sectionRect = sliderSection.getBoundingClientRect()
    const windowHeight = window.innerHeight

    // Check if section is "ready" to take control
    const sectionInMiddle = isSectionInMiddleOfScreen()

    if (hijackActive) {
      // Logic while hijacked: move horizontal or release
      const delta = e.deltaY
      const newPosition = sliderPosition + delta

      // Scrolling DOWN (delta > 0)
      if (delta > 0) {
        if (newPosition < maxTranslate) {
          // Still have room to scroll right
          e.preventDefault()
          sliderPosition = newPosition
          sliderWrapper.style.transform = `translateX(${-sliderPosition}px)`
        } else {
          // Hit the end (right side)
          // Snap to end
          if (sliderPosition !== maxTranslate) {
            sliderPosition = maxTranslate
            sliderWrapper.style.transform = `translateX(${-sliderPosition}px)`
          }
          // Release hijack
          hijackActive = false
          // Allow default scroll (page goes down)
        }
      }
      // Scrolling UP (delta < 0)
      else if (delta < 0) {
        if (newPosition > 0) {
          // Still have room to scroll left
          e.preventDefault()
          sliderPosition = newPosition
          sliderWrapper.style.transform = `translateX(${-sliderPosition}px)`
        } else {
          // Hit the start (left side)
          // Snap to start
          if (sliderPosition !== 0) {
            sliderPosition = 0
            sliderWrapper.style.transform = `translateX(${-sliderPosition}px)`
          }
          // Release hijack
          hijackActive = false
          // Allow default scroll (page goes up)
        }
      }
    } else {
      // Logic to START hijacking
      if (sectionInMiddle) {
        // If scrolling DOWN and we are at the START -> Hijack
        if (e.deltaY > 0 && sliderPosition <= 5) {
          hijackActive = true
          e.preventDefault()
        }
        // If scrolling UP and we are at the END -> Hijack
        else if (
          e.deltaY < 0 &&
          sliderPosition >= maxTranslate - 5 // Tolerance
        ) {
          hijackActive = true
          e.preventDefault()
        }
      }
    }
  },
  { passive: false }
)
