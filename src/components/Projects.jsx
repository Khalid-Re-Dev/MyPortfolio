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
      id: 100,
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
      id: 101,
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
      id: 102,
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
      id: 103,
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
    {
      id: 1,
      title: "Authority Website Management",
      shortDescription: "Managed and maintained the official authority website with analytics-driven improvements",
      fullDescription:
        "Part-time Technical Officer & Website Manager at Hadhramaut Organization for the Reform of the Inter-Related. Ensured high availability, updated content, and implemented front-end features to improve UX. Analyzed traffic to inform multilingual content decisions.",
      techStack: ["HTML5", "CSS3", "JavaScript", "Analytics"],
      duration: "Apr 2025 – Present",
      challenges: [
        "Keeping content up-to-date across multiple languages",
        "Improving UX while maintaining availability",
        "Analyzing 21K+ weekly requests across 10+ countries",
      ],
      image: "/placeholder.svg?height=300&width=500",
      liveUrl: "#",
      githubUrl: "",
      category: "Website Management",
      featured: true,
      designConsiderations: [
        "Multilingual content strategy",
        "Accessible UI patterns",
        "Performance-conscious updates",
        "Mobile-first responsiveness",
      ],
      backendTech: ["N/A"],
      frontendTech: ["HTML", "CSS", "JavaScript"],
      insights: [
        "Introduced analytics to guide content decisions",
        "Improved information architecture",
        "Established content update workflows",
      ],
    },
    {
      id: 2,
      title: "Foundation Web Platform",
      shortDescription: "Responsive site for projects, events, and donation portals with basic analytics",
      fullDescription:
        "Freelance Front-End Developer for Ahqaf Developmental Foundation. Built interactive components and responsive layouts to showcase projects and events, integrated forms and basic analytics to track engagement.",
      techStack: ["React", "TailwindCSS", "JavaScript", "Forms", "Analytics"],
      duration: "Apr 2025 – Present",
      challenges: [
        "Designing for content scalability",
        "Ensuring fast load on low-bandwidth",
        "Integrating forms and analytics reliably",
      ],
      image: "/placeholder.svg?height=300&width=500",
      liveUrl: "#",
      githubUrl: "",
      category: "Nonprofit",
      featured: true,
      designConsiderations: [
        "Clear information hierarchy",
        "Accessible color contrast",
        "Mobile-first layout",
        "Trust and donation-focused UI",
      ],
      backendTech: ["WordPress (hosting)", "Forms", "Analytics"],
      frontendTech: ["React", "TailwindCSS", "JavaScript"],
      insights: [
        "Improved conversions via UX refinements",
        "Established content publishing workflow",
        "Enhanced engagement tracking",
      ],
    },
    {
      id: 3,
      title: "Graduation Project – Intelligent Web Platform",
      shortDescription: "Led team to build an intelligent platform; won Silver Medal for innovation in Malaysia",
      fullDescription:
        "Led a team to create an intelligent web platform as part of university graduation project. Focus on AI-driven features, user-centric design, and robust frontend implementation.",
      techStack: ["React", "TailwindCSS", "JavaScript", "AI Concepts"],
      duration: "Academic Year 2024–2025",
      challenges: [
        "Balancing academic deadlines with high-quality delivery",
        "Designing AI-assisted features with clear UX",
        "Presenting innovation to competition judges",
      ],
      image: "/placeholder.svg?height=300&width=500",
      liveUrl: "#",
      githubUrl: "",
      category: "Academic",
      featured: true,
      designConsiderations: [
        "Clear UX for intelligent features",
        "Accessible and responsive design",
        "Performance-conscious interactions",
        "Structured documentation",
      ],
      backendTech: ["Prototype"],
      frontendTech: ["React", "TailwindCSS", "JavaScript"],
      insights: [
        "Iterated quickly with feedback loops",
        "Explored AI usability patterns",
        "Strengthened teamwork and leadership",
      ],
    },
    {
      id: 4,
      title: "Wasel – Food Delivery App UI",
      shortDescription: "Energetic UI/UX with clear flows: login, home, categories, product details, and cart.",
      fullDescription:
        "Figma-based UI/UX case study for a food delivery app focusing on clarity, speed, and conversion. Uses a vibrant yellow primary with neutral surfaces, card-based restaurant listing, and clear CTA patterns across the journey.",
      techStack: ["Figma", "Design System", "Prototyping"],
      duration: "Design Sprint: 1–2 weeks",
      challenges: [
        "Designing clear information hierarchy for categories",
        "Balancing visual energy with readability",
        "Designing scalable components for listings and cart",
      ],
      image: "/uiux/wasel-login.png",
      liveUrl: "https://www.figma.com/design/cHpjXyVUFMxPN0zI11Umkb/Untitled?node-id=0-1",
      githubUrl: "",
      category: "UI/UX Design",
      featured: true,
      designConsiderations: [
        "Mobile-first layout",
        "Accessible contrast for CTAs",
        "Card patterns with clear action affordances",
      ],
      backendTech: ["N/A"],
      frontendTech: ["Figma"],
      insights: [
        "Improved purchase flow clarity",
        "Reusable UI tokens and components",
      ],
    },
    {
      id: 5,
      title: "SM – Social Media Platform UI (Light & Dark)",
      shortDescription: "Three‑column layout with post cards and iconized side navigation, fully themed in light and dark.",
      fullDescription:
        "UI design exploring readability and density across light/dark themes. Emphasizes clear navigation, scannable post cards, and trend/follow modules with a balanced layout.",
      techStack: ["Figma", "Design Tokens", "Dark Mode"],
      duration: "Design Iterations: 1–2 weeks",
      challenges: [
        "Contrast and legibility in dark mode",
        "Component consistency across themes",
        "Balancing content density with clarity",
      ],
      image: "/uiux/sm-desktop-1.png",
      liveUrl: "https://www.figma.com/design/GVzkXQUupegqMLgIohZj4A/Untitled?node-id=0-1",
      githubUrl: "",
      category: "UI/UX Design",
      featured: false,
      designConsiderations: [
        "Typography scales for long-form feeds",
        "Icon-first navigation",
        "Responsive grid behavior",
      ],
      backendTech: ["N/A"],
      frontendTech: ["Figma"],
      insights: [
        "Refined theme tokens",
        "Accessible color ramps",
      ],
    },
    {
      id: 6,
      title: "JIFF Academy – Learning Platform UI",
      shortDescription: "Course discovery with filters and informative cards; strong hierarchy and action clarity.",
      fullDescription:
        "UI/UX design for an education platform. Home and courses emphasize trust, guidance, and quick scanning. Cards surface key details like teacher, time, and modality to aid selection.",
      techStack: ["Figma", "Auto Layout", "Prototyping"],
      duration: "Design Sprint: 1–2 weeks",
      challenges: [
        "Presenting dense course info simply",
        "Designing intuitive filters and tags",
        "Maintaining visual rhythm across sections",
      ],
      image: "/uiux/jiff-home.png",
      liveUrl: "https://www.figma.com/design/q7XK6TElA5yes2FQGHrb16/Untitled?node-id=0-1",
      githubUrl: "",
      category: "UI/UX Design",
      featured: false,
      designConsiderations: [
        "Card layouts for educational content",
        "Empty state guidance",
        "Discoverability via clear headings",
      ],
      backendTech: ["N/A"],
      frontendTech: ["Figma"],
      insights: [
        "Improved scanability and selection time",
      ],
    },
    {
      id: 7,
      title: "HOCF – Charity Organization Homepage",
      shortDescription: "Trust-building homepage highlighting programs, success stories, stats, and partners.",
      fullDescription:
        "Homepage UI for a charity organization focusing on credibility and storytelling. Structured hero, programs grid with icons, success stories, and partner logos to reinforce trust.",
      techStack: ["Figma", "Grid Systems", "Components"],
      duration: "Design Iterations: 1 week",
      challenges: [
        "Communicating credibility quickly",
        "Balancing emotion with clarity",
        "Keeping layout modular for content growth",
      ],
      image: "/uiux/hrc-hero.png",
      liveUrl: "https://www.figma.com/design/c2cGFu1tXiLl0hjeOJjP2G/Untitled?node-id=0-1",
      githubUrl: "",
      category: "UI/UX Design",
      featured: false,
      designConsiderations: [
        "Clear information hierarchy",
        "Consistent cards and iconography",
        "Responsive grid and spacing",
      ],
      backendTech: ["N/A"],
      frontendTech: ["Figma"],
      insights: [
        "Improved donor journey cues",
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
