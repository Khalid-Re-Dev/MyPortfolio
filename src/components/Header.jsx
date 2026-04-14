import { useState, useEffect, useCallback } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, X, Sun, Moon, Globe } from "lucide-react"
import { useTheme } from "../contexts/ThemeContext"
import { useLanguage } from "../contexts/LanguageContext"
import { useAuth } from "../contexts/AuthContext"
import { fadeInDown } from "../utils/animations"

/* ── Scroll Progress Bar (internal component) ── */
function ScrollProgressBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 w-full h-[3px] z-[60] bg-transparent pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-primary-500 to-accent-400 transition-[width] duration-75"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

/* ── Section IDs for IntersectionObserver ── */
const SECTION_IDS = ["hero", "about", "projects", "contact"]

/* ── Header ── */
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("hero")

  const { isDark, toggleTheme } = useTheme()
  const { language, toggleLanguage, isRTL, t } = useLanguage()
  const { user, logout, isAuthenticated } = useAuth()
  const location = useLocation()

  /* Entrance animation */
  useEffect(() => { fadeInDown(".header-animate", 0) }, [])

  /* Scroll detection */
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  /* Active section detection */
  useEffect(() => {
    if (location.pathname !== "/") return

    const observers = []
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id) },
        { threshold: 0.35, rootMargin: "-80px 0px 0px 0px" },
      )
      observer.observe(el)
      observers.push(observer)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [location.pathname])

  /* Smooth scroll handler */
  const scrollTo = useCallback((href) => (e) => {
    if (href.startsWith("#")) {
      e.preventDefault()
      const el = document.getElementById(href.slice(1))
      if (el) el.scrollIntoView({ behavior: "smooth" })
      setIsMenuOpen(false)
    }
  }, [])

  /* Nav items */
  const navigation = [
    { name: t("nav.home"), href: "#hero", section: "hero" },
    { name: t("nav.about"), href: "#about", section: "about" },
    { name: t("nav.projects"), href: "#projects", section: "projects" },
    { name: t("nav.contact"), href: "#contact", section: "contact" },
  ]

  const isNavActive = (section) => location.pathname === "/" && activeSection === section

  /* Dynamic header classes */
  const headerCls = isScrolled
    ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm"
    : "bg-transparent border-b border-transparent"

  return (
    <>
      <ScrollProgressBar />
      <header className={`header-animate fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerCls}`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex justify-between items-center transition-all duration-300 ${isScrolled ? "h-14" : "h-16"}`}>
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="font-bold text-xl text-primary-900 dark:text-white">Portfolio</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <a
                  key={item.section}
                  href={item.href}
                  onClick={scrollTo(item.href)}
                  className={`relative text-sm font-medium transition-colors duration-200 hover:text-primary-900 dark:hover:text-accent-300 ${
                    isNavActive(item.section)
                      ? "text-primary-900 dark:text-accent-300"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {item.name}
                  {/* Active dot indicator */}
                  {isNavActive(item.section) && (
                    <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-900 dark:bg-accent-300" />
                  )}
                </a>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
              </button>

              <button
                onClick={toggleLanguage}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-1"
                aria-label="Toggle language"
              >
                <Globe className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{language.toUpperCase()}</span>
              </button>

              {/* Auth */}
              {isAuthenticated ? (
                <div className="hidden sm:flex items-center space-x-2">
                  {user?.role === "admin" && (
                    <Link to="/dashboard" className="text-sm font-medium text-primary-900 dark:text-accent-300 hover:underline">
                      {t("nav.dashboard")}
                    </Link>
                  )}
                  <button onClick={logout} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400">
                    {t("nav.logout")}
                  </button>
                </div>
              ) : null}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="w-5 h-5 text-gray-600 dark:text-gray-300" /> : <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200/50 dark:border-gray-700/50">
              <div className="flex flex-col space-y-3">
                {navigation.map((item) => (
                  <a
                    key={item.section}
                    href={item.href}
                    onClick={scrollTo(item.href)}
                    className={`text-sm font-medium transition-colors duration-200 hover:text-primary-900 dark:hover:text-accent-300 px-2 py-1 rounded ${
                      isNavActive(item.section)
                        ? "text-primary-900 dark:text-accent-300 bg-primary-50 dark:bg-accent-400/10"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          )}
        </nav>
      </header>
    </>
  )
}

export default Header
