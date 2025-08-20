"use client"

import { useLanguage } from "@/components/providers/language-provider"
import { Github, Linkedin, Mail, Heart } from "lucide-react"

export default function Footer() {
  const { t } = useLanguage()

  const socialLinks = [
    {
      icon: <Github size={20} />,
      href: "https://github.com",
      label: "GitHub",
    },
    {
      icon: <Linkedin size={20} />,
      href: "https://linkedin.com",
      label: "LinkedIn",
    },
    {
      icon: <Mail size={20} />,
      href: "mailto:contact@example.com",
      label: "Email",
    },
  ]

  return (
    <footer className="bg-[var(--primary-navy)] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-2xl font-bold mb-4">Portfolio</h3>
              <p className="text-white/80 leading-relaxed">
                Frontend Developer specializing in React and modern web technologies. Creating beautiful, functional,
                and user-friendly web experiences.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#home" className="text-white/80 hover:text-white transition-colors duration-200">
                    {t("nav.home")}
                  </a>
                </li>
                <li>
                  <a href="#about" className="text-white/80 hover:text-white transition-colors duration-200">
                    {t("nav.about")}
                  </a>
                </li>
                <li>
                  <a href="#projects" className="text-white/80 hover:text-white transition-colors duration-200">
                    {t("nav.projects")}
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-white/80 hover:text-white transition-colors duration-200">
                    {t("nav.contact")}
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4 mb-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300 transform hover:scale-110"
                    aria-label={link.label}
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
              <p className="text-white/80 text-sm">Available for freelance opportunities</p>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/60 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Portfolio. All rights reserved.
            </p>
            <p className="text-white/60 text-sm flex items-center">
              Made with <Heart size={16} className="mx-1 text-red-400" /> using React & TailwindCSS
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
