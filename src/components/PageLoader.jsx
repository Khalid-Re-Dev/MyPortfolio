import { useEffect, useRef } from "react"
import anime from "animejs"

const PageLoader = ({ onComplete }) => {
  const loaderRef = useRef(null)

  useEffect(() => {
    /* Pulse the ring once, then fade out the entire loader */
    const tl = anime.timeline({ easing: "easeOutExpo" })

    tl.add({
      targets: ".loader-ring",
      rotate: [0, 360],
      duration: 1000,
      easing: "easeInOutQuad",
    })
    .add({
      targets: loaderRef.current,
      opacity: [1, 0],
      duration: 400,
      easing: "easeInQuad",
      complete: () => onComplete?.(),
    }, 1100)
  }, [onComplete])

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950"
    >
      <div className="relative flex items-center justify-center">
        {/* Spinning ring */}
        <div className="loader-ring absolute w-16 h-16 rounded-full border-2 border-transparent border-t-accent-300 border-r-primary-500" />
        {/* Initial letter */}
        <span className="text-2xl font-bold text-white select-none">A</span>
      </div>
    </div>
  )
}

export default PageLoader
