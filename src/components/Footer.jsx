import { useEffect, useRef } from "react"
import { Github, Linkedin } from "lucide-react"
import { useLanguage } from "../contexts/LanguageContext"
import { fadeInUp } from "../utils/animations"

const Whatsapp = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="currentColor" />
    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 01-4.29-1.243L4 20l1.243-3.71A8 8 0 1112 20z" fill="currentColor" />
  </svg>
)

const NAV = [
  { key: "nav.home", href: "#hero" },
  { key: "nav.about", href: "#about" },
  { key: "nav.projects", href: "#projects" },
  { key: "nav.contact", href: "#contact" },
]

const SOCIALS = [
  { href: "https://github.com/Abrar-Alharbi", icon: Github, label: "GitHub" },
  { href: "https://www.linkedin.com/in/abrar-alharbi", icon: Linkedin, label: "LinkedIn" },
  { href: "https://wa.me/966XXXXXXXXX", icon: Whatsapp, label: "WhatsApp" },
]

const Footer = () => {
  const { t, isRTL } = useLanguage()
  const footerRef = useRef(null)
  const animatedRef = useRef(false)

  useEffect(() => {
    const el = footerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animatedRef.current) {
          animatedRef.current = true
          fadeInUp(el, 0)
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const scrollTo = (href) => (e) => {
    e.preventDefault()
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <footer ref={footerRef} className="bg-gray-900 dark:bg-gray-950 text-gray-400 pt-14 pb-8" style={{ opacity: 0 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid sm:grid-cols-3 gap-10 mb-10 ${isRTL ? "text-right" : "text-left"}`}>

          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Khalid Badhawi</h3>
            <p className="text-sm leading-relaxed">{t("footer.tagline")}</p>
          </div>

          {/* Nav links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">{t("footer.quickLinks")}</h4>
            <ul className="space-y-2">
              {NAV.map((n) => (
                <li key={n.key}>
                  <a href={n.href} onClick={scrollTo(n.href)} className="text-sm hover:text-white transition-colors duration-200">
                    {t(n.key)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">{t("footer.connect")}</h4>
            <div className={`flex gap-3 ${isRTL ? "justify-end sm:justify-start" : ""}`}>
              {SOCIALS.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  className="p-2.5 rounded-lg bg-gray-800 hover:bg-primary-900 dark:hover:bg-accent-400 transition-colors duration-200 group">
                  <s.icon className="w-4 h-4 text-gray-400 group-hover:text-white dark:group-hover:text-gray-900" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-6 text-center text-xs">
          <p>© {new Date().getFullYear()} Khalid Badhawi. {t("footer.rights")}</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
