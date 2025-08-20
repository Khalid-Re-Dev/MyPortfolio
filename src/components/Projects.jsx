"use client"

import { useEffect, useRef, useState } from "react"
import { ExternalLink, Github, Lock, Eye } from "lucide-react"
import { useLanguage } from "../contexts/LanguageContext"
import { useAuth } from "../contexts/AuthContext"
import { fadeInUp, staggerAnimation } from "../utils/animations"
import ProjectModal from "./ProjectModal"

const Projects = () => {
  const { t } = useLanguage()
  const { isAuthenticated } = useAuth()
  const projectsRef = useRef(null)
  const [selectedProject, setSelectedProject] = useState(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            fadeInUp(".projects-title", 0)
            fadeInUp(".projects-subtitle", 200)
            staggerAnimation(".project-card", 150)
          }
        })
      },
      { threshold: 0.1 },
    )

    if (projectsRef.current) {
      observer.observe(projectsRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const projects = [
    {
      id: 1,
      title: "Best On Click",
      shortDescription: "E-commerce platform with modern UI and seamless user experience",
      fullDescription:
        "A comprehensive e-commerce solution built with React and Node.js, featuring user authentication, payment integration, inventory management, and admin dashboard. The platform handles thousands of products with advanced filtering and search capabilities.",
      techStack: ["React", "Node.js", "MongoDB", "Stripe", "TailwindCSS"],
      duration: "3 months",
      challenges: [
        "Implementing real-time inventory updates",
        "Optimizing performance for large product catalogs",
        "Integrating multiple payment gateways",
        "Building responsive design for all devices",
      ],
      image: "/placeholder.svg?height=300&width=500",
      liveUrl: "https://bestonclick.com",
      githubUrl: "https://github.com/username/bestonclick",
      category: "E-commerce",
      featured: true,
      designConsiderations: [
        "User-centered design approach",
        "Accessibility compliance (WCAG 2.1)",
        "Mobile-first responsive design",
        "Performance optimization for fast loading",
      ],
      backendTech: ["Express.js", "MongoDB", "JWT Authentication", "Cloudinary"],
      frontendTech: ["React", "Redux", "TailwindCSS", "Framer Motion"],
      insights: [
        "Learned advanced state management patterns",
        "Implemented efficient caching strategies",
        "Mastered payment gateway integrations",
        "Developed reusable component library",
      ],
    },
    {
      id: 2,
      title: "Editopia",
      shortDescription: "Advanced text editor with collaborative features and real-time editing",
      fullDescription:
        "A sophisticated text editor application with collaborative editing capabilities, real-time synchronization, and advanced formatting options. Built with modern web technologies to provide a seamless writing experience.",
      techStack: ["React", "Socket.io", "Node.js", "PostgreSQL", "Redis"],
      duration: "4 months",
      challenges: [
        "Implementing real-time collaborative editing",
        "Handling conflict resolution in concurrent edits",
        "Building rich text formatting features",
        "Ensuring data consistency across users",
      ],
      image: "/placeholder.svg?height=300&width=500",
      liveUrl: "https://editopia.app",
      githubUrl: "https://github.com/username/editopia",
      category: "Productivity",
      featured: true,
      designConsiderations: [
        "Minimalist interface for focus",
        "Intuitive toolbar design",
        "Collaborative indicators",
        "Responsive layout for all devices",
      ],
      backendTech: ["Express.js", "Socket.io", "PostgreSQL", "Redis"],
      frontendTech: ["React", "Draft.js", "Material-UI", "WebSocket"],
      insights: [
        "Mastered real-time communication protocols",
        "Implemented operational transformation",
        "Learned advanced database optimization",
        "Developed conflict resolution algorithms",
      ],
    },
    {
      id: 3,
      title: "Level Devil Game",
      shortDescription: "Interactive web-based game with engaging gameplay and smooth animations",
      fullDescription:
        "An entertaining web-based game featuring challenging levels, smooth animations, and engaging gameplay mechanics. Built with HTML5 Canvas and modern JavaScript for optimal performance.",
      techStack: ["JavaScript", "HTML5 Canvas", "CSS3", "Web Audio API"],
      duration: "2 months",
      challenges: [
        "Implementing smooth game physics",
        "Optimizing canvas rendering performance",
        "Creating engaging level progression",
        "Adding responsive touch controls",
      ],
      image: "/placeholder.svg?height=300&width=500",
      liveUrl: "https://leveldevil.game",
      githubUrl: "https://github.com/username/leveldevil",
      category: "Gaming",
      featured: false,
      designConsiderations: [
        "Engaging visual design",
        "Intuitive game controls",
        "Progressive difficulty curve",
        "Mobile-friendly interface",
      ],
      backendTech: ["Node.js", "Express.js", "MongoDB"],
      frontendTech: ["Vanilla JavaScript", "HTML5 Canvas", "CSS3"],
      insights: [
        "Learned game development principles",
        "Mastered canvas animation techniques",
        "Implemented efficient collision detection",
        "Optimized performance for mobile devices",
      ],
    },
    {
      id: 4,
      title: "Food Delivery App",
      shortDescription: "Full-stack food delivery platform with real-time tracking and payments",
      fullDescription:
        "A comprehensive food delivery application with restaurant management, order tracking, payment processing, and delivery coordination. Features real-time updates and intuitive user interface.",
      techStack: ["React Native", "Node.js", "MongoDB", "Socket.io", "Stripe"],
      duration: "5 months",
      challenges: [
        "Implementing real-time order tracking",
        "Building multi-vendor restaurant system",
        "Integrating payment and delivery APIs",
        "Creating responsive mobile experience",
      ],
      image: "/placeholder.svg?height=300&width=500",
      liveUrl: "https://fooddelivery.app",
      githubUrl: "https://github.com/username/fooddelivery",
      category: "Mobile App",
      featured: true,
      designConsiderations: [
        "User-friendly ordering flow",
        "Clear restaurant categorization",
        "Visual order tracking",
        "Accessible design patterns",
      ],
      backendTech: ["Express.js", "MongoDB", "Socket.io", "JWT"],
      frontendTech: ["React Native", "Redux", "Native Base"],
      insights: [
        "Learned mobile app development",
        "Implemented location-based services",
        "Mastered real-time data synchronization",
        "Developed complex state management",
      ],
    },
  ]

  const handleViewDetails = (project) => {
    setSelectedProject(project)
  }

  return (
    <>
      <section id="projects" ref={projectsRef} className="section-padding bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="projects-title text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t("projects.title")}
            </h2>
            <p className="projects-subtitle text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t("projects.subtitle")}
            </p>
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div key={project.id} className="project-card card p-0 overflow-hidden group">
                {/* Project Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {project.featured && (
                    <div className="absolute top-4 left-4 bg-primary-900 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </div>

                {/* Project Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-primary-900 dark:text-accent-300 font-medium">
                      {project.category}
                    </span>
                    <div className="flex space-x-2">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-primary-900 hover:text-white transition-colors duration-200"
                          aria-label="View live project"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-primary-900 hover:text-white transition-colors duration-200"
                          aria-label="View source code"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{project.title}</h3>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{project.shortDescription}</p>

                  {/* Tech Stack */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t("projects.techStack")}:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-900 dark:text-accent-300 text-xs rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.techStack.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                          +{project.techStack.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Duration */}
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span className="font-medium">{t("projects.duration")}:</span> {project.duration}
                  </p>

                  {/* View Details Button */}
                  <button
                    onClick={() => handleViewDetails(project)}
                    className="w-full btn-primary flex items-center justify-center space-x-2"
                  >
                    {!isAuthenticated && <Lock className="w-4 h-4" />}
                    <Eye className="w-4 h-4" />
                    <span>{t("projects.viewDetails")}</span>
                  </button>
                </div>
              </div>
            ))}
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

export default Projects
