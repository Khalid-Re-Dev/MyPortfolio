"use client"

import { useEffect, useRef } from "react"
import { ChevronDown, Github, Linkedin, Mail, Facebook } from "lucide-react"
import { useLanguage } from "../contexts/LanguageContext"
import { fadeInUp, fadeInLeft } from "../utils/animations"

const Whatsapp = (props) => (
  <svg {...props} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="currentColor" opacity="0.1"/><path d="M23.472 19.382c-.355-.177-2.1-1.034-2.424-1.153-.324-.118-.56-.177-.797.177-.237.355-.917 1.153-1.125 1.39-.207.237-.414.266-.769.089-.355-.178-1.5-.553-2.86-1.763-1.057-.943-1.77-2.107-1.98-2.462-.207-.355-.022-.546.155-.723.159-.158.355-.414.532-.62.178-.207.237-.355.355-.592.118-.237.06-.444-.03-.62-.089-.177-.797-1.92-1.09-2.63-.287-.691-.58-.597-.797-.608-.207-.009-.444-.011-.68-.011-.237 0-.62.089-.945.444-.324.355-1.24 1.213-1.24 2.956 0 1.743 1.267 3.429 1.444 3.669.178.237 2.5 3.82 6.063 5.209.849.292 1.51.466 2.027.596.851.203 1.626.174 2.238.106.682-.076 2.1-.858 2.398-1.687.296-.83.296-1.541.207-1.687-.089-.148-.324-.237-.68-.414z" fill="#25D366"/><path d="M16 29.333c-7.364 0-13.333-5.97-13.333-13.333S8.636 2.667 16 2.667 29.333 8.636 29.333 16 23.364 29.333 16 29.333zm0-24C9.383 5.333 4 10.716 4 16.667c0 2.383.77 4.6 2.183 6.417l-1.45 5.3 5.433-1.433A11.96 11.96 0 0016 27.333c6.617 0 12-5.383 12-12S22.617 5.333 16 5.333z" fill="#25D366"/></svg>
)

const Hero = () => {
  const { t, isRTL } = useLanguage()
  const heroRef = useRef(null)

  useEffect(() => {
    if (heroRef.current) {
      fadeInUp(".hero-title", 0)
      fadeInUp(".hero-subtitle", 200)
      fadeInUp(".hero-buttons", 400)
      fadeInLeft(".hero-social", 600)
    }
  }, [])

  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section
      ref={heroRef}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-accent-50 to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-primary-900/20 pt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Profile Image */}
          <div className="hero-title mb-8">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r from-primary-900 to-accent-300 p-1">
              <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                <span className="text-4xl font-bold text-primary-900 dark:text-accent-300">P</span>
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className={`hero-title text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 ${isRTL ? "text-right" : "text-left"}`}>
            <span className="block">{t("hero.title")}</span>
            <span className="block text-primary-900 dark:text-accent-300 mt-2">{t("hero.roleAddon")}</span>
          </h1>

          {/* Subtitle */}
          <p className={`hero-subtitle text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed ${isRTL ? "text-right" : "text-left"}`}>
            {t("hero.subtitle")}
          </p>

          {/* CTA Buttons */}
          <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button onClick={scrollToProjects} className="btn-primary w-full sm:w-auto">
              {t("hero.cta")}
            </button>
            <a href="#contact" className="btn-secondary w-full sm:w-auto">
              {t("hero.contact")}
            </a>
          </div>

          {/* Social Links */}
          <div className={`hero-social flex justify-center ${isRTL ? "space-x-reverse" : ""} space-x-6 mb-12`}>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
              aria-label="GitHub"
            >
              <Github className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-6 h-6 text-blue-600" />
            </a>
            <a
              href="mailto:contact@example.com"
              className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
              aria-label="Email"
            >
              <Mail className="w-6 h-6 text-green-600" />
            </a>
            <a
              href="https://wa.me/201234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
              aria-label="WhatsApp"
            >
              <Whatsapp className="w-6 h-6" />
            </a>
            <a
              href="https://facebook.com/yourprofile"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
              aria-label="Facebook"
            >
              <Facebook className="w-6 h-6 text-blue-700" />
            </a>
          </div>
          {/* Scroll Indicator */}
          <div className="animate-bounce">
            <ChevronDown className="w-8 h-8 text-gray-400 mx-auto cursor-pointer" onClick={scrollToProjects} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
