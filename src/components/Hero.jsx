import { useEffect, useRef, useState, useCallback } from "react"
import { Github, Linkedin, ChevronDown, Download } from "lucide-react"
import { useLanguage } from "../contexts/LanguageContext"
import anime from "animejs"
import { fadeInUp, scaleIn, floatAnimation, staggerFadeInUp } from "../utils/animations"

/* WhatsApp SVG icon — kept from original */
const Whatsapp = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="currentColor" />
    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 01-4.29-1.243L4 20l1.243-3.71A8 8 0 1112 20z" fill="currentColor" />
  </svg>
)

/* Typing role titles — bilingual */
const ROLES = {
  en: ["UI/UX Designer", "Frontend Developer", "Creative Thinker"],
  ar: ["مصمم واجهات UI/UX", "مطور واجهات أمامية", "مفكر إبداعي"],
}

const Hero = () => {
  const { t, isRTL, language } = useLanguage()
  const heroRef = useRef(null)
  const orbRef = useRef(null)
  const typingRef = useRef(null)
  const cursorRef = useRef(null)
  const animationsRan = useRef(false)

  /* ---------- typing effect ---------- */
  const [displayText, setDisplayText] = useState("")
  const typingState = useRef({ roleIdx: 0, charIdx: 0, deleting: false, paused: false })
  const typingTimer = useRef(null)

  const tick = useCallback(() => {
    const roles = ROLES[language] || ROLES.en
    const s = typingState.current
    const currentRole = roles[s.roleIdx % roles.length]

    if (s.paused) {
      s.paused = false
      s.deleting = true
      typingTimer.current = setTimeout(tick, 80)
      return
    }

    if (!s.deleting) {
      s.charIdx++
      setDisplayText(currentRole.slice(0, s.charIdx))
      if (s.charIdx >= currentRole.length) {
        s.paused = true
        typingTimer.current = setTimeout(tick, 2000)
        return
      }
      typingTimer.current = setTimeout(tick, 90)
    } else {
      s.charIdx--
      setDisplayText(currentRole.slice(0, s.charIdx))
      if (s.charIdx <= 0) {
        s.deleting = false
        s.roleIdx++
        typingTimer.current = setTimeout(tick, 400)
        return
      }
      typingTimer.current = setTimeout(tick, 50)
    }
  }, [language])

  /* restart typing when language changes */
  useEffect(() => {
    typingState.current = { roleIdx: 0, charIdx: 0, deleting: false, paused: false }
    setDisplayText("")
    clearTimeout(typingTimer.current)
    typingTimer.current = setTimeout(tick, 800)
    return () => clearTimeout(typingTimer.current)
  }, [language, tick])

  /* ---------- entrance animations (run ONCE) ---------- */
  useEffect(() => {
    if (animationsRan.current) return
    animationsRan.current = true

    /* set initial opacity to 0 for animated elements */
    document.querySelectorAll("[data-hero-anim]").forEach((el) => {
      el.style.opacity = "0"
    })

    fadeInUp("[data-hero-anim='name']", 200)
    fadeInUp("[data-hero-anim='role']", 600)
    fadeInUp("[data-hero-anim='bio']", 800)
    staggerFadeInUp("[data-hero-anim='cta']", 150, 1000)
    staggerFadeInUp("[data-hero-anim='social']", 100, 1200)
    scaleIn("[data-hero-anim='orb']", 400)

    /* continuous float for the orb */
    setTimeout(() => floatAnimation(orbRef.current), 1200)
  }, [])

  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden pt-16
        bg-gradient-to-br from-white via-accent-50/40 to-primary-50
        dark:from-gray-950 dark:via-gray-900 dark:to-primary-900/20"
    >
      {/* Dot grid background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(0,31,63,.07) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 dark:block hidden"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(127,219,255,.06) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${isRTL ? "lg:direction-rtl" : ""}`}>

          {/* ── Text Column ── */}
          <div className={`order-2 lg:order-1 ${isRTL ? "lg:order-2 text-right" : "text-left"} text-center lg:text-inherit`}>

            {/* Greeting + Name */}
            <div data-hero-anim="name">
              <p className="text-sm sm:text-base font-medium tracking-widest uppercase text-primary-500 dark:text-accent-400 mb-3">
                {isRTL ? "مرحباً، أنا" : "Hi, I'm"}
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight">
                {isRTL ? "خالد باضاوي" : "Khalid Badhawi"}
              </h1>
            </div>

            {/* Typing Role */}
            <div data-hero-anim="role" className="mt-4 mb-6 min-h-[2.5rem] sm:min-h-[3rem]">
              <span className="text-xl sm:text-2xl lg:text-3xl font-semibold text-primary-900 dark:text-accent-300">
                <span ref={typingRef}>{displayText}</span>
                <span
                  ref={cursorRef}
                  className="inline-block w-[3px] h-[1.1em] bg-primary-900 dark:bg-accent-300 align-middle animate-pulse"
                  style={{ marginInlineStart: "2px" }}
                />
              </span>
            </div>

            {/* Bio */}
            <p data-hero-anim="bio" className="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8">
              {t("hero.subtitle")}
            </p>

            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10 ${isRTL ? "sm:flex-row-reverse lg:justify-end" : ""}`}>
              <button data-hero-anim="cta" onClick={scrollToProjects} className="btn-primary w-full sm:w-auto">
                {t("hero.cta")}
              </button>
              <a
                data-hero-anim="cta"
                href="/cv.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary w-full sm:w-auto inline-flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                {t("hero.downloadCV")}
              </a>
            </div>

            {/* Social Icons */}
            <div className={`flex gap-4 justify-center lg:justify-start ${isRTL ? "lg:justify-end" : ""}`}>
              {[
                { href: "https://github.com/Abrar-Alharbi", icon: Github, label: "GitHub", color: "text-gray-700 dark:text-gray-300" },
                { href: "https://www.linkedin.com/in/abrar-alharbi", icon: Linkedin, label: "LinkedIn", color: "text-blue-600" },
                { href: "https://wa.me/966XXXXXXXXX", icon: Whatsapp, label: "WhatsApp", color: "text-green-500" },
              ].map((s) => (
                <a
                  key={s.label}
                  data-hero-anim="social"
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className={`p-3 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur shadow-md hover:shadow-lg ${s.color} hover:scale-110 transition-all duration-200`}
                >
                  <s.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* ── Visual Column — Gradient Orb ── */}
          <div className={`order-1 lg:order-2 ${isRTL ? "lg:order-1" : ""} flex justify-center`}>
            <div
              ref={orbRef}
              data-hero-anim="orb"
              className="relative w-56 h-56 sm:w-72 sm:h-72 lg:w-96 lg:h-96"
            >
              {/* Outer glow ring */}
              <div className="absolute inset-0 rounded-full border-2 border-primary-400/20 dark:border-accent-400/20" />
              <div className="absolute -inset-4 rounded-full border border-primary-300/10 dark:border-accent-300/10" />

              {/* Main orb gradient (behind image) */}
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-primary-500 via-primary-700 to-primary-900 dark:from-accent-400 dark:via-primary-600 dark:to-primary-900 shadow-2xl" />

              {/* Profile photo */}
              <div className="absolute inset-2 rounded-full overflow-hidden">
                <img
                  src="/Me.jpg"
                  alt={isRTL ? "خالد باضاوي" : "Khalid Badhawi"}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Glass overlay — subtle shine on top of photo */}
              <div className="absolute inset-2 rounded-full bg-gradient-to-t from-primary-900/30 via-transparent to-white/15 dark:from-primary-900/40 dark:to-white/10 pointer-events-none" />

              {/* Ambient glow */}
              <div className="absolute -inset-8 rounded-full bg-primary-500/10 dark:bg-accent-400/10 blur-3xl -z-10" />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown
            className="w-7 h-7 text-gray-400 dark:text-gray-500 cursor-pointer"
            onClick={scrollToProjects}
          />
        </div>
      </div>
    </section>
  )
}

export default Hero
