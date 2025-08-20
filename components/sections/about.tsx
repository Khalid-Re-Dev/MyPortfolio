"use client"

import { useEffect, useRef } from "react"
import { useLanguage } from "@/components/providers/language-provider"
import { Code, Palette, Zap, Award } from "lucide-react"
import { animateOnScroll } from "@/lib/animations"

export default function About() {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateOnScroll(entry.target as HTMLElement)
          }
        })
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const skills = [
    { name: "React", level: 90 },
    { name: "TailwindCSS", level: 95 },
    { name: "JavaScript", level: 88 },
    { name: "TypeScript", level: 85 },
    { name: "Next.js", level: 82 },
    { name: "Node.js", level: 75 },
  ]

  const achievements = [
    {
      icon: <Code className="w-8 h-8" />,
      title: "50+ Projects",
      description: "Successfully completed projects",
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "UI/UX Design",
      description: "Modern and responsive designs",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Performance",
      description: "Optimized for speed and SEO",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "3+ Years",
      description: "Professional experience",
    },
  ]

  return (
    <section id="about" ref={sectionRef} className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="about-title text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 opacity-0">
              {t("about.title")}
            </h2>
            <p className="about-subtitle text-xl text-[var(--primary-navy)] dark:text-[var(--primary-light-blue)] font-medium opacity-0">
              {t("about.subtitle")}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Description & Achievements */}
            <div className="about-content opacity-0">
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">{t("about.description")}</p>

              {/* Achievements Grid */}
              <div className="grid grid-cols-2 gap-6">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="achievement-card p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 opacity-0"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="text-[var(--primary-navy)] dark:text-[var(--primary-light-blue)] mb-3">
                      {achievement.icon}
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">{achievement.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Skills */}
            <div className="about-skills opacity-0">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">{t("about.skills")}</h3>

              <div className="space-y-6">
                {skills.map((skill, index) => (
                  <div key={skill.name} className="skill-item opacity-0" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900 dark:text-white">{skill.name}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className="skill-bar h-3 bg-gradient-to-r from-[var(--primary-navy)] to-[var(--primary-light-blue)] rounded-full transition-all duration-1000 ease-out"
                        style={{ width: "0%" }}
                        data-width={`${skill.level}%`}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
