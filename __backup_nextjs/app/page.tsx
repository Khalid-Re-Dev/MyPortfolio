"use client"

import { useEffect } from "react"
import Header from "@/components/layout/header"
import Hero from "@/components/sections/hero"
import About from "@/components/sections/about"
import Projects from "@/components/sections/projects"
import Contact from "@/components/sections/contact"
import Footer from "@/components/layout/footer"
import { initializeAnimations } from "@/lib/animations"

export default function Home() {
  useEffect(() => {
    initializeAnimations()
  }, [])

  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <About />
      <Projects />
      <Contact />
      <Footer />
    </main>
  )
}
