// Animation utilities using CSS animations and Intersection Observer
// Note: For production, you would install and use anime.js library

export const initializeAnimations = () => {
  // Initialize any global animation settings
  console.log("Animations initialized")
}

export const animateHero = (element: HTMLElement) => {
  const greeting = element.querySelector(".hero-greeting")
  const name = element.querySelector(".hero-name")
  const title = element.querySelector(".hero-title")
  const subtitle = element.querySelector(".hero-subtitle")
  const buttons = element.querySelector(".hero-buttons")
  const social = element.querySelector(".hero-social")
  const scroll = element.querySelector(".hero-scroll")

  const elements = [greeting, name, title, subtitle, buttons, social, scroll]

  elements.forEach((el, index) => {
    if (el) {
      setTimeout(() => {
        el.classList.remove("opacity-0")
        el.classList.add("animate-fade-in-up")
      }, index * 200)
    }
  })
}

export const animateOnScroll = (element: HTMLElement) => {
  // About section animations
  if (element.id === "about") {
    const title = element.querySelector(".about-title")
    const subtitle = element.querySelector(".about-subtitle")
    const content = element.querySelector(".about-content")
    const skills = element.querySelector(".about-skills")
    const achievementCards = element.querySelectorAll(".achievement-card")
    const skillItems = element.querySelectorAll(".skill-item")

    // Animate title and subtitle
    if (title) {
      title.classList.remove("opacity-0")
      title.classList.add("animate-fade-in-up")
    }
    if (subtitle) {
      setTimeout(() => {
        subtitle.classList.remove("opacity-0")
        subtitle.classList.add("animate-fade-in-up")
      }, 200)
    }

    // Animate content sections
    if (content) {
      setTimeout(() => {
        content.classList.remove("opacity-0")
        content.classList.add("animate-fade-in-left")
      }, 400)
    }
    if (skills) {
      setTimeout(() => {
        skills.classList.remove("opacity-0")
        skills.classList.add("animate-fade-in-right")
      }, 600)
    }

    // Animate achievement cards
    achievementCards.forEach((card, index) => {
      setTimeout(
        () => {
          card.classList.remove("opacity-0")
          card.classList.add("animate-fade-in-up")
        },
        800 + index * 100,
      )
    })

    // Animate skill items and progress bars
    skillItems.forEach((item, index) => {
      setTimeout(
        () => {
          item.classList.remove("opacity-0")
          item.classList.add("animate-fade-in-right")

          // Animate skill bar
          const skillBar = item.querySelector(".skill-bar") as HTMLElement
          if (skillBar) {
            const width = skillBar.getAttribute("data-width")
            setTimeout(() => {
              skillBar.style.width = width || "0%"
            }, 300)
          }
        },
        1000 + index * 100,
      )
    })
  }

  // Projects section animations
  if (element.id === "projects") {
    const title = element.querySelector(".projects-title")
    const subtitle = element.querySelector(".projects-subtitle")
    const projectCards = element.querySelectorAll(".project-card")

    if (title) {
      title.classList.remove("opacity-0")
      title.classList.add("animate-fade-in-up")
    }
    if (subtitle) {
      setTimeout(() => {
        subtitle.classList.remove("opacity-0")
        subtitle.classList.add("animate-fade-in-up")
      }, 200)
    }

    projectCards.forEach((card, index) => {
      setTimeout(
        () => {
          card.classList.remove("opacity-0")
          card.classList.add("animate-fade-in-up")
        },
        400 + index * 200,
      )
    })
  }

  // Contact section animations
  if (element.id === "contact") {
    const title = element.querySelector(".contact-title")
    const subtitle = element.querySelector(".contact-subtitle")
    const info = element.querySelector(".contact-info")
    const form = element.querySelector(".contact-form")
    const contactItems = element.querySelectorAll(".contact-item")
    const additional = element.querySelector(".contact-additional")

    if (title) {
      title.classList.remove("opacity-0")
      title.classList.add("animate-fade-in-up")
    }
    if (subtitle) {
      setTimeout(() => {
        subtitle.classList.remove("opacity-0")
        subtitle.classList.add("animate-fade-in-up")
      }, 200)
    }

    if (info) {
      setTimeout(() => {
        info.classList.remove("opacity-0")
        info.classList.add("animate-fade-in-left")
      }, 400)
    }
    if (form) {
      setTimeout(() => {
        form.classList.remove("opacity-0")
        form.classList.add("animate-fade-in-right")
      }, 600)
    }

    contactItems.forEach((item, index) => {
      setTimeout(
        () => {
          item.classList.remove("opacity-0")
          item.classList.add("animate-fade-in-up")
        },
        800 + index * 100,
      )
    })

    if (additional) {
      setTimeout(() => {
        additional.classList.remove("opacity-0")
        additional.classList.add("animate-fade-in-up")
      }, 1200)
    }
  }
}

// Utility function to add stagger animation to elements
export const staggerAnimation = (elements: NodeListOf<Element>, delay = 100) => {
  elements.forEach((element, index) => {
    setTimeout(() => {
      element.classList.remove("opacity-0")
      element.classList.add("animate-fade-in-up")
    }, index * delay)
  })
}

// Utility function for hover animations
export const addHoverAnimations = () => {
  const cards = document.querySelectorAll(".hover-lift")
  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.classList.add("transform", "scale-105", "shadow-xl")
    })
    card.addEventListener("mouseleave", () => {
      card.classList.remove("transform", "scale-105", "shadow-xl")
    })
  })
}
