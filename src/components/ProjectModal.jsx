import { useEffect, useCallback } from "react"
import { X, ExternalLink, Github, Clock, Zap, Figma } from "lucide-react"
import { useLanguage } from "../contexts/LanguageContext"
import { modalReveal } from "../utils/animations"

const ProjectModal = ({ project, isOpen, onClose }) => {
  const { t, isRTL } = useLanguage()

  /* Lock body scroll & animate in */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      /* small delay so the DOM is painted before animation */
      requestAnimationFrame(() => modalReveal(".modal-panel"))
    }
    return () => { document.body.style.overflow = "unset" }
  }, [isOpen])

  /* Close on Escape */
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") onClose()
  }, [onClose])

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  if (!isOpen || !project) return null

  const hasLive = project.liveUrl && project.liveUrl !== "#"
  const hasGithub = project.githubUrl && project.githubUrl !== ""
  const isFigma = project.category === "UI/UX Design"
  const images = project.image && !project.image.includes("placeholder")
    ? [project.image]
    : []

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="modal-panel bg-white dark:bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        style={{ opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className={`sticky top-0 z-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-b border-gray-200 dark:border-gray-700 p-5 flex items-start justify-between gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
          <div className={isRTL ? "text-right" : ""}>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
              {project.title}
            </h2>
            <div className={`flex items-center gap-2 mt-1.5 ${isRTL ? "flex-row-reverse" : ""}`}>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-accent-300">
                {project.category}
              </span>
              {project.featured && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-100 dark:bg-accent-900/20 text-accent-700 dark:text-accent-300">
                  ★ Featured
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* ── Body ── */}
        <div className={`p-5 sm:p-6 ${isRTL ? "text-right" : "text-left"}`}>

          {/* Image gallery strip */}
          {images.length > 0 && (
            <div className="mb-6 -mx-5 sm:-mx-6">
              <div className="flex gap-3 overflow-x-auto px-5 sm:px-6 pb-2 snap-x">
                {images.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`${project.title} screenshot ${i + 1}`}
                    className="h-56 sm:h-64 rounded-xl object-cover snap-start flex-shrink-0"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Info grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">

            {/* Left column */}
            <div className={isRTL ? "md:order-2" : ""}>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                {t("projects.overview")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-5">
                {project.fullDescription}
              </p>

              {/* Duration */}
              <div className="mb-5">
                <h4 className={`font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2 text-sm ${isRTL ? "flex-row-reverse" : ""}`}>
                  <Clock className="w-4 h-4 text-primary-500 dark:text-accent-400" />
                  {t("projects.duration")}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{project.duration}</p>
              </div>

              {/* Challenges */}
              <div>
                <h4 className={`font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2 text-sm ${isRTL ? "flex-row-reverse" : ""}`}>
                  <Zap className="w-4 h-4 text-primary-500 dark:text-accent-400" />
                  {t("projects.challenges")}
                </h4>
                <ul className="space-y-1.5">
                  {project.challenges.map((c, i) => (
                    <li key={i} className={`flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-500 dark:bg-accent-400 flex-shrink-0" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right column */}
            <div className={isRTL ? "md:order-1" : ""}>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                {t("projects.technicalDetails")}
              </h3>

              {/* Tech Stack */}
              <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-accent-400 mb-2">
                  {t("projects.techStack")}
                </p>
                <div className={`flex flex-wrap gap-1.5 ${isRTL ? "justify-end" : ""}`}>
                  {project.techStack.map((tech) => (
                    <span key={tech} className="px-2.5 py-1 text-xs rounded-full border border-primary-200/60 dark:border-accent-400/25 text-primary-700 dark:text-accent-200 bg-primary-50/60 dark:bg-gray-800/60">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Frontend */}
              <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-accent-400 mb-2">
                  {t("projects.frontendTech")}
                </p>
                <div className={`flex flex-wrap gap-1.5 ${isRTL ? "justify-end" : ""}`}>
                  {project.frontendTech.map((tech) => (
                    <span key={tech} className="px-2.5 py-1 text-xs rounded-full border border-accent-200/60 dark:border-accent-400/20 text-accent-700 dark:text-accent-300 bg-accent-50/60 dark:bg-gray-800/60">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Backend */}
              <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-accent-400 mb-2">
                  {t("projects.backendTech")}
                </p>
                <div className={`flex flex-wrap gap-1.5 ${isRTL ? "justify-end" : ""}`}>
                  {project.backendTech.map((tech) => (
                    <span key={tech} className="px-2.5 py-1 text-xs rounded-full border border-green-200/60 dark:border-green-400/20 text-green-700 dark:text-green-300 bg-green-50/60 dark:bg-gray-800/60">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className={`flex flex-wrap gap-3 ${isRTL ? "justify-end" : ""}`}>
                {hasLive && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                    className="btn-primary inline-flex items-center gap-2 text-sm !py-2.5 !px-5">
                    <ExternalLink className="w-4 h-4" />
                    {t("projects.liveDemo")}
                  </a>
                )}
                {hasGithub && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <Github className="w-4 h-4" />
                    {t("projects.viewCode")}
                  </a>
                )}
                {isFigma && hasLive && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-lg border border-purple-300 dark:border-purple-500/40 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                    <Figma className="w-4 h-4" />
                    {t("projects.viewFigma")}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Design considerations */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
              {t("projects.designConsiderations")}
            </h3>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {project.designConsiderations.map((item, i) => (
                <div key={i} className={`flex items-start gap-2.5 p-3 bg-gray-50 dark:bg-gray-800/60 rounded-lg ${isRTL ? "flex-row-reverse text-right" : ""}`}>
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-500 dark:bg-accent-400 flex-shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dev insights */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
              {t("projects.devInsights")}
            </h3>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {project.insights.map((item, i) => (
                <div key={i} className={`flex items-start gap-2.5 p-3 bg-accent-50/60 dark:bg-accent-900/10 rounded-lg ${isRTL ? "flex-row-reverse text-right" : ""}`}>
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectModal
