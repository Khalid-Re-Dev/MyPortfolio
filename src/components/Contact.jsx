import { useEffect, useRef, useState } from "react"
import { Mail, Phone, MapPin, Send, Github, Linkedin } from "lucide-react"
import { useLanguage } from "../contexts/LanguageContext"
import { fadeInUp, fadeInLeft, fadeInRight } from "../utils/animations"
import { toast } from "react-toastify"
import api from "../utils/api"

/* WhatsApp icon */
const Whatsapp = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="currentColor"/>
    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 01-4.29-1.243L4 20l1.243-3.71A8 8 0 1112 20z" fill="currentColor"/>
  </svg>
)

const CONTACT_INFO = [
  { icon: Mail, labelKey: "contact.email", value: "kh99.wa.bd@gmail.com", href: "mailto:kh99.wa.bd@gmail.com" },
  { icon: Phone, labelKey: "contact.phone", value: "+967 778 219 726", href: "tel:+967778219726" },
  { icon: MapPin, labelKey: "contact.location", value: null, href: null },
]

const INPUT_CLS = "w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800/80 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 text-sm"

const Contact = () => {
  const { t, isRTL } = useLanguage()
  const sectionRef = useRef(null)
  const animatedRef = useRef(false)

  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)

  /* Entrance animation */
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animatedRef.current) {
          animatedRef.current = true
          el.querySelectorAll("[data-contact-anim]").forEach((n) => { n.style.opacity = "0" })
          fadeInUp("[data-contact-anim='header']", 0)
          if (isRTL) {
            fadeInRight("[data-contact-anim='info']", 200)
            fadeInLeft("[data-contact-anim='form']", 400)
          } else {
            fadeInLeft("[data-contact-anim='info']", 200)
            fadeInRight("[data-contact-anim='form']", 400)
          }
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [isRTL])

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.subject || !formData.message) return
    setIsSubmitting(true)
    try {
      await api.post("/contact", formData)
      toast.success(t("contact.messageSent"))
      setFormData({ name: "", email: "", subject: "", message: "" })
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || t("contact.messageError")
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" ref={sectionRef} className="relative section-padding bg-white dark:bg-gray-900 overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div data-contact-anim="header" className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3">
            {t("contact.title")}
          </h2>
          <div className="mx-auto w-20 h-1 rounded-full bg-gradient-to-r from-primary-500 to-accent-400 mb-5" />
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t("contact.subtitle")}
          </p>
        </div>

        <div className={`grid lg:grid-cols-2 gap-12 lg:gap-16 ${isRTL ? "direction-rtl" : ""}`}>

          {/* ── Left: Contact Info ── */}
          <div data-contact-anim="info" className={`${isRTL ? "lg:order-2 text-right" : "lg:order-1 text-left"}`}>

            {/* Info cards */}
            <div className="space-y-4 mb-8">
              {CONTACT_INFO.map((info) => {
                const Wrapper = info.href ? "a" : "div"
                return (
                  <Wrapper
                    key={info.labelKey}
                    {...(info.href ? { href: info.href } : {})}
                    className={`flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-800
                      hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 group
                      ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <div className="w-11 h-11 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center group-hover:bg-primary-900 dark:group-hover:bg-accent-400 transition-colors flex-shrink-0">
                      <info.icon className="w-5 h-5 text-primary-700 dark:text-accent-300 group-hover:text-white dark:group-hover:text-gray-900" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">{t(info.labelKey)}</p>
                      <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">{info.value || t(info.labelKey)}</p>
                    </div>
                  </Wrapper>
                )
              })}
            </div>

            {/* CTA card */}
            <div className="rounded-2xl bg-gradient-to-br from-primary-50/80 to-accent-50/80 dark:from-gray-800/80 dark:to-gray-800/40 border border-primary-100/50 dark:border-gray-700/50 p-6">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t("contact.letsWork")}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">{t("contact.letsWorkDesc")}</p>
              <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{t("contact.available")}</span>
              </div>
            </div>

            {/* Social links */}
            <div className={`flex gap-3 mt-6 ${isRTL ? "justify-end" : "justify-start"}`}>
              {[
                { href: "https://github.com/Abrar-Alharbi", icon: Github, label: "GitHub", color: "text-gray-700 dark:text-gray-300" },
                { href: "https://www.linkedin.com/in/abrar-alharbi", icon: Linkedin, label: "LinkedIn", color: "text-blue-600" },
                { href: "https://wa.me/966XXXXXXXXX", icon: Whatsapp, label: "WhatsApp", color: "text-green-500" },
              ].map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  className={`p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 ${s.color} hover:scale-110 transition-all duration-200`}>
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* ── Right: Form ── */}
          <div data-contact-anim="form" className={`${isRTL ? "lg:order-1" : "lg:order-2"}`}>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t("contact.name")}</label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className={INPUT_CLS} placeholder={t("contact.namePlaceholder")} />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t("contact.email")}</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className={INPUT_CLS} placeholder={t("contact.emailPlaceholder")} />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t("contact.subject")}</label>
                <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required className={INPUT_CLS} placeholder={t("contact.subjectPlaceholder")} />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t("contact.message")}</label>
                <textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={5} className={`${INPUT_CLS} resize-none`} placeholder={t("contact.messagePlaceholder")} />
              </div>

              <button type="submit" disabled={isSubmitting}
                className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{t("contact.sending")}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{t("contact.send")}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Section divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-300/40 dark:via-accent-400/20 to-transparent" />
    </section>
  )
}

export default Contact
