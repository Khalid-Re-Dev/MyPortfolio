"use client"

import { useEffect, useRef } from "react"
import { useLanguage } from "@/components/providers/language-provider"
import { ChevronDown, Github, Linkedin, Mail } from "lucide-react"
import { animateHero } from "@/lib/animations"

export default function Hero() {
  const { t } = useLanguage()
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (heroRef.current) {
      animateHero(heroRef.current)
    }
  }, [])

  return (
    <section
      id="home"
      ref={heroRef}
      className="min-h-screen flex items-center justify-center relative overflow-hidden gradient-navy"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-[var(--primary-light-blue)] rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Greeting */}
          <p className="hero-greeting text-xl md:text-2xl text-white/80 mb-4 opacity-0">{t("hero.greeting")}</p>

          {/* Name */}
          <h1 className="hero-name text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 opacity-0">
            Ahmed Hassan
          </h1>

          {/* Title */}
          <h2 className="hero-title text-2xl md:text-4xl lg:text-5xl font-light text-[var(--primary-light-blue)] mb-8 opacity-0">
            {t("hero.title")}
          </h2>

          {/* Subtitle */}
          <p className="hero-subtitle text-lg md:text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed opacity-0">
            {t("hero.subtitle")}
          </p>

          {/* CTA Buttons */}
          <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 opacity-0">
            <a
              href="#projects"
              className="px-8 py-4 bg-[var(--primary-light-blue)] text-[var(--primary-navy)] rounded-lg font-semibold hover:bg-white transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              {t("hero.cta")}
            </a>
            <a
              href="#contact"
              className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-[var(--primary-navy)] transition-all duration-300 transform hover:scale-105"
            >
              {t("hero.contact")}
            </a>
          </div>

          {/* Social Links */}
          <div className="hero-social flex justify-center space-x-6 mb-16 opacity-0">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all duration-300 transform hover:scale-110"
              aria-label="GitHub"
            >
              <Github size={24} className="text-white" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all duration-300 transform hover:scale-110"
              aria-label="LinkedIn"
            >
              <Linkedin size={24} className="text-white" />
            </a>
            <a
              href="mailto:contact@example.com"
              className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all duration-300 transform hover:scale-110"
              aria-label="Email"
            >
              <Mail size={24} className="text-white" />
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="hero-scroll absolute bottom-8 left-1/2 transform -translate-x-1/2 opacity-0">
          <a
            href="#about"
            className="flex flex-col items-center text-white/70 hover:text-white transition-colors duration-300"
          >
            <span className="text-sm mb-2">Scroll Down</span>
            <ChevronDown size={24} className="animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  )
}
