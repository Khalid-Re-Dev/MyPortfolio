"use client"

import { useState, useEffect, useRef } from "react"
import { useLanguage } from "@/components/providers/language-provider"
import { useAuth } from "@/components/providers/auth-provider"
import { ExternalLink, Github, Lock, Eye } from "lucide-react"
import ProjectModal from "@/components/projects/project-modal"
import { animateOnScroll } from "@/lib/animations"

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

export default function Projects() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    fetchProjects()
  }, [])

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

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects")
      const data = await response.json()
      setProjects(data.projects || mockProjects)
    } catch (error) {
      console.error("Failed to fetch projects:", error)
      setProjects(mockProjects)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = async (project: Project) => {
    if (!user) {
      alert(t("projects.loginRequired"))
      return
    }

    // Track project view
    try {
      await fetch("/api/analytics/project-view", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("portfolio-token")}`,
        },
        body: JSON.stringify({ projectId: project.id }),
      })
    } catch (error) {
      console.error("Failed to track project view:", error)
    }

    setSelectedProject(project)
  }

  // Mock projects data
  const mockProjects: Project[] = [
    {
      id: "1",
      title: "Best On Click",
      description: "Modern e-commerce platform with advanced filtering and search capabilities",
      longDescription:
        "A comprehensive e-commerce solution built with React and Node.js, featuring real-time inventory management, advanced product filtering, secure payment integration, and responsive design. The platform includes an admin dashboard for managing products, orders, and customer data.",
      techStack: ["React", "Node.js", "MongoDB", "Express", "TailwindCSS", "Stripe"],
      duration: "3 months",
      challenges: [
        "Implementing real-time inventory updates",
        "Optimizing search performance for large product catalogs",
        "Ensuring secure payment processing",
        "Creating responsive design for all devices",
      ],
      image: "/placeholder.svg?height=400&width=600",
      liveUrl: "https://bestonclick.com",
      githubUrl: "https://github.com/username/bestonclick",
      featured: true,
    },
    {
      id: "2",
      title: "Editopia",
      description: "Collaborative text editor with real-time synchronization",
      longDescription:
        "A powerful collaborative text editor that allows multiple users to edit documents simultaneously with real-time synchronization. Features include version control, comment system, rich text formatting, and document sharing capabilities.",
      techStack: ["React", "Socket.io", "Node.js", "MongoDB", "Quill.js"],
      duration: "2 months",
      challenges: [
        "Implementing real-time collaboration",
        "Handling conflict resolution in simultaneous edits",
        "Optimizing performance for large documents",
        "Creating intuitive user interface",
      ],
      image: "/placeholder.svg?height=400&width=600",
      liveUrl: "https://editopia.app",
      githubUrl: "https://github.com/username/editopia",
      featured: true,
    },
    {
      id: "3",
      title: "Level Devil Game",
      description: "Interactive web-based puzzle game with progressive difficulty",
      longDescription:
        "An engaging puzzle game built with vanilla JavaScript and Canvas API. Features multiple levels with increasing difficulty, smooth animations, local storage for progress saving, and responsive controls for both desktop and mobile devices.",
      techStack: ["JavaScript", "HTML5 Canvas", "CSS3", "Local Storage"],
      duration: "1 month",
      challenges: [
        "Creating smooth game animations",
        "Implementing collision detection",
        "Optimizing performance for mobile devices",
        "Designing engaging level progression",
      ],
      image: "/placeholder.svg?height=400&width=600",
      liveUrl: "https://leveldevil.game",
      githubUrl: "https://github.com/username/level-devil",
      featured: true,
    },
    {
      id: "4",
      title: "Food Delivery App",
      description: "Full-stack food delivery application with real-time tracking",
      longDescription:
        "A comprehensive food delivery platform featuring restaurant listings, menu management, order tracking, payment integration, and delivery management. Includes separate interfaces for customers, restaurants, and delivery personnel.",
      techStack: ["React Native", "Node.js", "PostgreSQL", "Redis", "Google Maps API"],
      duration: "4 months",
      challenges: [
        "Implementing real-time order tracking",
        "Integrating multiple payment gateways",
        "Optimizing map performance",
        "Managing complex state across different user roles",
      ],
      image: "/placeholder.svg?height=400&width=600",
      liveUrl: "https://fooddelivery.app",
      githubUrl: "https://github.com/username/food-delivery",
      featured: true,
    },
  ]

  if (loading) {
    return (
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="spinner mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">{t("common.loading")}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <section id="projects" ref={sectionRef} className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="projects-title text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 opacity-0">
                {t("projects.title")}
              </h2>
              <p className="projects-subtitle text-xl text-[var(--primary-navy)] dark:text-[var(--primary-light-blue)] font-medium opacity-0">
                {t("projects.subtitle")}
              </p>
            </div>

            {/* Projects Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
              {projects
                .filter((p) => p.featured)
                .map((project, index) => (
                  <div
                    key={project.id}
                    className="project-card bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 opacity-0"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    {/* Project Image */}
                    <div className="relative overflow-hidden">
                      <img
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex flex-wrap gap-2">
                            {project.techStack.slice(0, 3).map((tech) => (
                              <span
                                key={tech}
                                className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full"
                              >
                                {tech}
                              </span>
                            ))}
                            {project.techStack.length > 3 && (
                              <span className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full">
                                +{project.techStack.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Project Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{project.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{project.description}</p>

                      {/* Project Actions */}
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => handleViewDetails(project)}
                          className="flex items-center space-x-2 px-4 py-2 bg-[var(--primary-navy)] text-white rounded-lg hover:bg-[#003366] transition-colors duration-200"
                        >
                          {user ? <Eye size={16} /> : <Lock size={16} />}
                          <span>{t("projects.viewDetails")}</span>
                        </button>

                        <div className="flex space-x-2">
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                              aria-label="View live project"
                            >
                              <ExternalLink size={16} />
                            </a>
                          )}
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                              aria-label="View source code"
                            >
                              <Github size={16} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* Project Modal */}
      {selectedProject && (
        <ProjectModal project={selectedProject} isOpen={!!selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </>
  )
}
