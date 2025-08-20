"use client"

import { useLanguage } from "@/components/providers/language-provider"
import { X, ExternalLink, Github, Calendar, Zap } from "lucide-react"

interface Project {
  id: string
  title: string
  description: string
  longDescription: string
  techStack: string[]
  duration: string
  challenges: string[]
  image: string
  liveUrl?: string
  githubUrl?: string
  featured: boolean
}

interface ProjectModalProps {
  project: Project
  isOpen: boolean
  onClose: () => void
}

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const { t } = useLanguage()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{project.title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Project Image */}
          <div className="mb-6">
            <img
              src={project.image || "/placeholder.svg"}
              alt={project.title}
              className="w-full h-64 object-cover rounded-lg shadow-lg"
            />
          </div>

          {/* Project Info Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Duration */}
            <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Calendar className="text-[var(--primary-navy)] dark:text-[var(--primary-light-blue)]" size={20} />
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">{t("projects.duration")}</h4>
                <p className="text-gray-600 dark:text-gray-400">{project.duration}</p>
              </div>
            </div>

            {/* Tech Stack Count */}
            <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Zap className="text-[var(--primary-navy)] dark:text-[var(--primary-light-blue)]" size={20} />
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">{t("projects.techStack")}</h4>
                <p className="text-gray-600 dark:text-gray-400">{project.techStack.length} Technologies</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Project Overview</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{project.longDescription}</p>
          </div>

          {/* Tech Stack */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t("projects.techStack")}</h3>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-[var(--primary-navy)] text-white rounded-full text-sm font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Challenges */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t("projects.challenges")}</h3>
            <ul className="space-y-2">
              {project.challenges.map((challenge, index) => (
                <li key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="w-2 h-2 bg-[var(--primary-navy)] dark:bg-[var(--primary-light-blue)] rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">{challenge}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-[var(--primary-navy)] text-white rounded-lg hover:bg-[#003366] transition-all duration-300 transform hover:scale-105"
              >
                <ExternalLink size={20} />
                <span>{t("projects.viewLive")}</span>
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 px-6 py-3 border-2 border-[var(--primary-navy)] text-[var(--primary-navy)] dark:border-[var(--primary-light-blue)] dark:text-[var(--primary-light-blue)] rounded-lg hover:bg-[var(--primary-navy)] hover:text-white dark:hover:bg-[var(--primary-light-blue)] dark:hover:text-[var(--primary-navy)] transition-all duration-300 transform hover:scale-105"
              >
                <Github size={20} />
                <span>{t("projects.viewCode")}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
