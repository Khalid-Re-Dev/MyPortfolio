import anime from "animejs"

export const fadeInUp = (targets, delay = 0) => {
  return anime({
    targets,
    translateY: [30, 0],
    opacity: [0, 1],
    duration: 800,
    delay,
    easing: "easeOutExpo",
  })
}

export const fadeInLeft = (targets, delay = 0) => {
  return anime({
    targets,
    translateX: [-30, 0],
    opacity: [0, 1],
    duration: 800,
    delay,
    easing: "easeOutExpo",
  })
}

export const fadeInRight = (targets, delay = 0) => {
  return anime({
    targets,
    translateX: [30, 0],
    opacity: [0, 1],
    duration: 800,
    delay,
    easing: "easeOutExpo",
  })
}

export const fadeInDown = (targets, delay = 0) => {
  return anime({
    targets,
    translateY: [-30, 0],
    opacity: [0, 1],
    duration: 800,
    delay,
    easing: "easeOutExpo",
  })
}

export const scaleIn = (targets, delay = 0) => {
  return anime({
    targets,
    scale: [0.8, 1],
    opacity: [0, 1],
    duration: 600,
    delay,
    easing: "easeOutBack",
  })
}

export const staggerAnimation = (targets, delay = 100) => {
  return anime({
    targets,
    translateY: [20, 0],
    opacity: [0, 1],
    duration: 600,
    delay: anime.stagger(delay),
    easing: "easeOutExpo",
  })
}

export const buttonHover = (target) => {
  return anime({
    targets: target,
    scale: 1.05,
    duration: 200,
    easing: "easeOutQuad",
  })
}

export const buttonLeave = (target) => {
  return anime({
    targets: target,
    scale: 1,
    duration: 200,
    easing: "easeOutQuad",
  })
}

export const cardHover = (target) => {
  return anime({
    targets: target,
    translateY: -5,
    boxShadow: "0 20px 40px rgba(0, 31, 63, 0.1)",
    duration: 300,
    easing: "easeOutQuad",
  })
}

export const cardLeave = (target) => {
  return anime({
    targets: target,
    translateY: 0,
    boxShadow: "0 10px 25px rgba(0, 31, 63, 0.05)",
    duration: 300,
    easing: "easeOutQuad",
  })
}
