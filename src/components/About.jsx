import { useEffect, useRef } from "react"
import { Award } from "lucide-react"
import { useLanguage } from "../contexts/LanguageContext"
import { fadeInUp, staggerFadeInUp, countUp } from "../utils/animations"

/* ── Static data extracted from original About.jsx ── */

const SKILL_CATEGORIES = [
  {
    label: { en: "Frontend", ar: "تطوير الواجهات" },
    skills: ["React", "JavaScript", "HTML5", "CSS3", "TailwindCSS"],
  },
  {
    label: { en: "Design Tools", ar: "أدوات التصميم" },
    skills: ["Figma", "Adobe XD", "Responsive Design", "User Experience"],
  },
  {
    label: { en: "Performance & QA", ar: "الأداء والجودة" },
    skills: ["SEO", "Accessibility", "Testing", "Code Review", "Optimization"],
  },
]

const STATS = [
  { value: 11, key: "about.stat.projects" },
  { value: 15, key: "about.stat.clients" },
  { value: 2, key: "about.stat.experience" },
  { value: 1, key: "about.stat.awards" },
]

const ACHIEVEMENT_KEYS = [
  "about.achievement.1",
  "about.achievement.2",
  "about.achievement.3",
  "about.achievement.4",
  "about.achievement.5",
]

/* ── Component ── */

const About = () => {
  const { t, isRTL, language } = useLanguage()
  const sectionRef = useRef(null)
  const animatedRef = useRef(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animatedRef.current) {
          animatedRef.current = true

          /* set initial opacity */
          section.querySelectorAll("[data-about-anim]").forEach((el) => {
            el.style.opacity = "0"
          })

          fadeInUp("[data-about-anim='header']", 0)
          fadeInUp("[data-about-anim='bio']", 200)
          fadeInUp("[data-about-anim='achievements']", 400)
          staggerFadeInUp("[data-about-anim='skill-group']", 150, 300)
          staggerFadeInUp("[data-about-anim='chip']", 60, 500)

          /* Stats: fade in first, then count */
          fadeInUp("[data-about-anim='stats']", 600)
          setTimeout(() => countUp(".stat-number", 0), 800)
        }
      },
      { threshold: 0.15 },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative section-padding bg-white dark:bg-gray-900 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">

        {/* ── Section Header ── */}
        <div data-about-anim="header" className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3">
            {t("about.title")}
          </h2>
          <div className="mx-auto w-20 h-1 rounded-full bg-gradient-to-r from-primary-500 to-accent-400 mb-5" />
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            {t("about.subtitle")}
          </p>
        </div>

        {/* ── Main Two-Column Grid ── */}
        <div className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-16 ${isRTL ? "direction-rtl" : ""}`}>

          {/* — Left: Bio + Achievements — */}
          <div className={`${isRTL ? "lg:order-2 text-right" : "lg:order-1 text-left"}`}>

            {/* Bio */}
            <div data-about-anim="bio" className="mb-8">
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                {t("about.description")}
              </p>
            </div>

            {/* Achievements */}
            <div data-about-anim="achievements">
              <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white mb-5">
                <Award className="w-5 h-5 text-primary-500 dark:text-accent-400 flex-shrink-0" />
                {t("about.achievements")}
              </h3>
              <ul className="space-y-3">
                {ACHIEVEMENT_KEYS.map((key) => (
                  <li key={key} className={`flex items-start gap-3 ${isRTL ? "flex-row-reverse text-right" : ""}`}>
                    <span className="mt-2 w-2 h-2 rounded-full bg-primary-500 dark:bg-accent-400 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed">
                      {t(key)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* — Right: Skills — */}
          <div className={`${isRTL ? "lg:order-1 text-right" : "lg:order-2 text-left"}`}>
            <div className="bg-gradient-to-br from-primary-50/60 to-accent-50/60 dark:from-gray-800/80 dark:to-gray-800/40 rounded-2xl p-6 sm:p-8 border border-primary-100/50 dark:border-gray-700/50">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                {t("about.skills")}
              </h3>

              <div className="space-y-6">
                {SKILL_CATEGORIES.map((cat) => (
                  <div key={cat.label.en} data-about-anim="skill-group">
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-accent-400 mb-3">
                      {cat.label[language] || cat.label.en}
                    </p>
                    <div className={`flex flex-wrap gap-2 ${isRTL ? "justify-end" : "justify-start"}`}>
                      {cat.skills.map((skill) => (
                        <span
                          key={skill}
                          data-about-anim="chip"
                          className="px-3 py-1.5 text-sm rounded-full border border-primary-300/60 dark:border-accent-400/30
                            text-primary-800 dark:text-accent-200
                            bg-white/70 dark:bg-gray-900/50
                            hover:bg-primary-900 hover:text-white dark:hover:bg-accent-400 dark:hover:text-gray-900
                            transition-all duration-200 cursor-default select-none"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div data-about-anim="stats" className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((stat) => (
            <div
              key={stat.key}
              className="text-center py-6 px-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/40"
            >
              <span
                className="stat-number block text-3xl sm:text-4xl font-bold text-primary-900 dark:text-accent-300 mb-1"
                data-target={stat.value}
              >
                0
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                {t(stat.key)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section divider ── */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-300/40 dark:via-accent-400/20 to-transparent" />
    </section>
  )
}

export default About
