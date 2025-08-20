"use client"
import { Github, Linkedin, Mail, Heart, Facebook } from "lucide-react"
import { useLanguage } from "../contexts/LanguageContext"

const Whatsapp = (props) => (
  <svg {...props} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="currentColor" opacity="0.1"/><path d="M23.472 19.382c-.355-.177-2.1-1.034-2.424-1.153-.324-.118-.56-.177-.797.177-.237.355-.917 1.153-1.125 1.39-.207.237-.414.266-.769.089-.355-.178-1.5-.553-2.86-1.763-1.057-.943-1.77-2.107-1.98-2.462-.207-.355-.022-.546.155-.723.159-.158.355-.414.532-.62.178-.207.237-.355.355-.592.118-.237.06-.444-.03-.62-.089-.177-.797-1.92-1.09-2.63-.287-.691-.58-.597-.797-.608-.207-.009-.444-.011-.68-.011-.237 0-.62.089-.945.444-.324.355-1.24 1.213-1.24 2.956 0 1.743 1.267 3.429 1.444 3.669.178.237 2.5 3.82 6.063 5.209.849.292 1.51.466 2.027.596.851.203 1.626.174 2.238.106.682-.076 2.1-.858 2.398-1.687.296-.83.296-1.541.207-1.687-.089-.148-.324-.237-.68-.414z" fill="#25D366"/><path d="M16 29.333c-7.364 0-13.333-5.97-13.333-13.333S8.636 2.667 16 2.667 29.333 8.636 29.333 16 23.364 29.333 16 29.333zm0-24C9.383 5.333 4 10.716 4 16.667c0 2.383.77 4.6 2.183 6.417l-1.45 5.3 5.433-1.433A11.96 11.96 0 0016 27.333c6.617 0 12-5.383 12-12S22.617 5.333 16 5.333z" fill="#25D366"/></svg>
)

const Footer = () => {
  const { t } = useLanguage()
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    {
      icon: Github,
      href: "https://github.com",
      label: "GitHub",
    },
    {
      icon: Linkedin,
      href: "https://linkedin.com",
      label: "LinkedIn",
    },
    {
      icon: Mail,
      href: "mailto:contact@portfolio.com",
      label: "Email",
    },
    {
      icon: Whatsapp,
      href: "https://wa.me/201234567890",
      label: "WhatsApp",
    },
    {
      icon: Facebook,
      href: "https://facebook.com/yourprofile",
      label: "Facebook",
    },
  ]

  return (
    <footer className="bg-gray-900 dark:bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="font-bold text-xl">Portfolio</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Front-End Developer passionate about creating beautiful and functional web experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="text-gray-400 hover:text-white transition-colors duration-200">
                  {t("nav.about")}
                </a>
              </li>
              <li>
                <a href="#projects" className="text-gray-400 hover:text-white transition-colors duration-200">
                  {t("nav.projects")}
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-400 hover:text-white transition-colors duration-200">
                  {t("nav.contact")}
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Connect</h3>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-gray-800 hover:bg-primary-900 transition-colors duration-200 group"
                  aria-label={link.label}
                >
                  <link.icon className="w-5 h-5 text-gray-400 group-hover:text-white" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">© {currentYear} Portfolio. All rights reserved.</p>
          <p className="text-gray-400 text-sm flex items-center">
            Made with <Heart className="w-4 h-4 text-red-500 mx-1" /> using React & TailwindCSS
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
