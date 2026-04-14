import { useEffect, useRef, useState, useMemo } from "react"
import { Eye, ExternalLink, ChevronDown, ChevronUp } from "lucide-react"
import { useLanguage } from "../contexts/LanguageContext"
import { fadeInUp, staggerFadeInUp } from "../utils/animations"
import ProjectModal from "./ProjectModal"
import { projects, categories } from "../data/projects"

const INITIAL_COUNT = 6

/* ── ProjectCard (extracted sub-component) ── */

const ProjectCard = ({ project, onView, isRTL }) => {
  const img = project.image && !project.image.includes("placeholder")
    ? project.image
    : null

  return (
    <div
      className="project-card group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden
        shadow-md hover:shadow-xl border border-gray-100 dark:border-gray-700/50
        transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        {img ? (
          <img
            src={img}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-600 to-primary-900 dark:from-primary-700 dark:to-gray-900 flex items-center justify-center">
            <span className="text-5xl font-bold text-white/30 select-none">
              {project.title.charAt(0)}
            </span>
          </div>
        )}

        {/* Category badge */}
        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-semibold
          bg-white/90 dark:bg-gray-900/80 text-primary-800 dark:text-accent-300 backdrop-blur-sm">
          {project.category}
        </span>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-primary-900/0 group-hover:bg-primary-900/60 transition-colors duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
          <button
            onClick={() => onView(project)}
            className="p-3 rounded-full bg-white/90 text-primary-900 hover:bg-white transition-all duration-200 hover:scale-110"
            aria-label="View details"
          >
            <Eye className="w-5 h-5" />
          </button>
          {project.liveUrl && project.liveUrl !== "#" && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-white/90 text-primary-900 hover:bg-white transition-all duration-200 hover:scale-110"
              aria-label="Open live site"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <div className={`p-5 ${isRTL ? "text-right" : "text-left"}`}>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1.5 line-clamp-1">
          {project.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 leading-relaxed">
          {project.shortDescription}
        </p>

        {/* Tech chips */}
        <div className={`flex flex-wrap gap-1.5 ${isRTL ? "justify-end" : "justify-start"}`}>
          {project.techStack.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 text-xs rounded-full border border-primary-200/60 dark:border-accent-400/25
                text-primary-700 dark:text-accent-300 bg-primary-50/80 dark:bg-gray-900/60"
            >
              {tech}
            </span>
          ))}
          {project.techStack.length > 3 && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
              +{project.techStack.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Main Projects component ── */

const Projects = () => {
  const { t, isRTL } = useLanguage()
  const sectionRef = useRef(null)
  const animatedRef = useRef(false)

  const [selectedProject, setSelectedProject] = useState(null)
  const [activeFilter, setActiveFilter] = useState("All")
  const [showAll, setShowAll] = useState(false)
  const [fading, setFading] = useState(false)

  /* Sort: featured first, then by id desc */
  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => {
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      return b.id - a.id
    })
  }, [])

  /* Filter logic */
  const filteredProjects = useMemo(() => {
    if (activeFilter === "All") return sortedProjects
    return sortedProjects.filter((p) => p.category === activeFilter)
  }, [activeFilter, sortedProjects])

  const visibleProjects = showAll ? filteredProjects : filteredProjects.slice(0, INITIAL_COUNT)
  const hasMore = filteredProjects.length > INITIAL_COUNT

  /* Entrance animation (once) */
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animatedRef.current) {
          animatedRef.current = true
          section.querySelectorAll("[data-proj-anim]").forEach((el) => {
            el.style.opacity = "0"
          })
          fadeInUp("[data-proj-anim='header']", 0)
          staggerFadeInUp("[data-proj-anim='filter']", 80, 200)
          staggerFadeInUp(".project-card", 100, 400)
        }
      },
      { threshold: 0.1 },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  /* Filter change with CSS fade */
  const handleFilter = (cat) => {
    if (cat === activeFilter) return
    setFading(true)
    setTimeout(() => {
      setActiveFilter(cat)
      setShowAll(false)
      setFading(false)
    }, 200)
  }

  return (
    <>
      <section
        id="projects"
        ref={sectionRef}
        className="relative section-padding bg-gray-50 dark:bg-gray-800/50"
      >
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div data-proj-anim="header" className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3">
              {t("projects.title")}
            </h2>
            <div className="mx-auto w-20 h-1 rounded-full bg-gradient-to-r from-primary-500 to-accent-400 mb-5" />
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t("projects.subtitle")}
            </p>
          </div>

          {/* Filter bar */}
          <div className={`flex flex-wrap justify-center gap-2 mb-10 ${isRTL ? "flex-row-reverse" : ""}`}>
            {categories.map((cat) => (
              <button
                key={cat}
                data-proj-anim="filter"
                onClick={() => handleFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                  ${activeFilter === cat
                    ? "bg-primary-900 text-white dark:bg-accent-400 dark:text-gray-900 shadow-md"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-accent-400/40"
                  }`}
              >
                {cat === "All" ? t("projects.all") : cat}
              </button>
            ))}
          </div>

          {/* Cards grid */}
          <div
            className={`grid md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-200 ${fading ? "opacity-30" : "opacity-100"}`}
          >
            {visibleProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onView={setSelectedProject}
                isRTL={isRTL}
              />
            ))}
          </div>

          {/* Show More / Less */}
          {hasMore && (
            <div className="text-center mt-10">
              <button
                onClick={() => setShowAll(!showAll)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full
                  bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300
                  border border-gray-200 dark:border-gray-700
                  hover:border-primary-400 dark:hover:border-accent-400/40
                  font-medium text-sm transition-all duration-200 hover:shadow-md"
              >
                {showAll ? (
                  <>
                    {t("projects.showLess")}
                    <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    {t("projects.showMore")}
                    <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Section divider */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-300/40 dark:via-accent-400/20 to-transparent" />
      </section>

      {/* Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  )
}

export default Projects
