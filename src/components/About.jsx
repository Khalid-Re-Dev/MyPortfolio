"use client"

import { useEffect, useRef } from "react"
import { Code, Palette, Zap, Award } from "lucide-react"
import { useLanguage } from "../contexts/LanguageContext"
import { fadeInUp, staggerAnimation } from "../utils/animations"

const About = () => {
  const { t } = useLanguage()
  const aboutRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            fadeInUp(".about-title", 0)
            fadeInUp(".about-description", 200)
            staggerAnimation(".skill-card", 100)
          }
        })
      },
      { threshold: 0.1 },
    )

    if (aboutRef.current) {
      observer.observe(aboutRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const skills = [
    {
      icon: Code,
      title: "Frontend Development",
      description: "React, JavaScript, HTML5, CSS3, TailwindCSS",
      color: "text-blue-600",
    },
    {
      icon: Palette,
      title: "UI/UX Design",
      description: "Figma, Adobe XD, Responsive Design, User Experience",
      color: "text-purple-600",
    },
    {
      icon: Zap,
      title: "Performance",
      description: "Optimization, SEO, Accessibility, Best Practices",
      color: "text-yellow-600",
    },
    {
      icon: Award,
      title: "Quality Assurance",
      description: "Testing, Code Review, Documentation, Debugging",
      color: "text-green-600",
    },
  ]

  const achievements = [
    "Silver Medal in a Malaysian competition for an innovative graduation-project concept",
    "Analyzed 21K+ weekly site requests across 10+ countries to guide multilingual content improvements",
    "Maintained positive client relationships with 15 corporate customers",
    "Built responsive, content-rich websites with analytics and form handling",
    "Strong focus on UX/UI, motion graphics, and continuous learning",
  ]

  return (
    <section id="about" ref={aboutRef} className="section-padding bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="about-title text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t("about.title")}
          </h2>
          <p className="about-description text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t("about.subtitle")}
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Description */}
          <div className="about-description">
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">{t("about.description")}</p>

            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t("about.achievements")}</h3>
            <ul className="space-y-3">
              {achievements.map((achievement, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-900 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-600 dark:text-gray-300">{achievement}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Skills Visual */}
          <div className="about-description">
            <div className="bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">{t("about.skills")}</h3>
              <div className="space-y-4">
                {["React", "JavaScript", "TailwindCSS", "HTML/CSS", "UI/UX Design"].map((skill, index) => (
                  <div key={skill} className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{skill}</span>
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-3 h-3 rounded-full ${
                            i < (5 - index * 0.5) ? "bg-primary-900" : "bg-gray-300 dark:bg-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Skills Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="skill-card card p-6 text-center group hover:bg-gradient-to-br hover:from-primary-50 hover:to-accent-50 dark:hover:from-gray-700 dark:hover:to-gray-600"
            >
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <skill.icon className={`w-8 h-8 ${skill.color}`} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{skill.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{skill.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default About
