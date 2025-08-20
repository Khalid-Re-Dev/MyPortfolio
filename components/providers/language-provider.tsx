"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type Language = "en" | "ar"

type LanguageProviderProps = {
  children: React.ReactNode
  defaultLanguage?: Language
}

type LanguageProviderState = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.about": "About",
    "nav.projects": "Projects",
    "nav.contact": "Contact",
    "nav.login": "Login",
    "nav.dashboard": "Dashboard",
    "nav.logout": "Logout",

    // Hero Section
    "hero.greeting": "Hello, I'm",
    "hero.title": "Frontend Developer",
    "hero.subtitle": "Crafting beautiful and functional web experiences with React & TailwindCSS",
    "hero.cta": "View My Work",
    "hero.contact": "Get In Touch",

    // About Section
    "about.title": "About Me",
    "about.subtitle": "Passionate Frontend Developer",
    "about.description":
      "I specialize in creating modern, responsive web applications using React, TailwindCSS, and JavaScript. With a strong foundation in HTML, CSS, and JavaScript, I bring designs to life with clean, efficient code.",
    "about.skills": "Technical Skills",
    "about.experience": "Experience",
    "about.years": "Years of Experience",

    // Projects Section
    "projects.title": "Featured Projects",
    "projects.subtitle": "Showcasing my best work",
    "projects.viewDetails": "View Details",
    "projects.viewLive": "View Live",
    "projects.viewCode": "View Code",
    "projects.techStack": "Tech Stack",
    "projects.duration": "Duration",
    "projects.challenges": "Key Challenges",
    "projects.loginRequired": "Login required to view full project details",

    // Contact Section
    "contact.title": "Get In Touch",
    "contact.subtitle": "Let's work together",
    "contact.name": "Name",
    "contact.email": "Email",
    "contact.message": "Message",
    "contact.send": "Send Message",
    "contact.sending": "Sending...",

    // Auth
    "auth.login": "Login",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.loginButton": "Sign In",
    "auth.loginSuccess": "Login successful!",
    "auth.loginError": "Invalid credentials",
    "auth.logoutSuccess": "Logged out successfully",

    // Common
    "common.loading": "Loading...",
    "common.error": "Something went wrong",
    "common.success": "Success!",
    "common.close": "Close",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",
  },
  ar: {
    // Navigation
    "nav.home": "الرئيسية",
    "nav.about": "نبذة عني",
    "nav.projects": "المشاريع",
    "nav.contact": "تواصل معي",
    "nav.login": "تسجيل الدخول",
    "nav.dashboard": "لوحة التحكم",
    "nav.logout": "تسجيل الخروج",

    // Hero Section
    "hero.greeting": "مرحباً، أنا",
    "hero.title": "مطور واجهات أمامية",
    "hero.subtitle": "أقوم بإنشاء تجارب ويب جميلة وعملية باستخدام React و TailwindCSS",
    "hero.cta": "اطلع على أعمالي",
    "hero.contact": "تواصل معي",

    // About Section
    "about.title": "نبذة عني",
    "about.subtitle": "مطور واجهات أمامية شغوف",
    "about.description":
      "أتخصص في إنشاء تطبيقات ويب حديثة ومتجاوبة باستخدام React و TailwindCSS و JavaScript. مع أساس قوي في HTML و CSS و JavaScript، أحول التصاميم إلى حياة بكود نظيف وفعال.",
    "about.skills": "المهارات التقنية",
    "about.experience": "الخبرة",
    "about.years": "سنوات من الخبرة",

    // Projects Section
    "projects.title": "المشاريع المميزة",
    "projects.subtitle": "عرض أفضل أعمالي",
    "projects.viewDetails": "عرض التفاصيل",
    "projects.viewLive": "عرض مباشر",
    "projects.viewCode": "عرض الكود",
    "projects.techStack": "التقنيات المستخدمة",
    "projects.duration": "المدة الزمنية",
    "projects.challenges": "التحديات الرئيسية",
    "projects.loginRequired": "يتطلب تسجيل الدخول لعرض تفاصيل المشروع كاملة",

    // Contact Section
    "contact.title": "تواصل معي",
    "contact.subtitle": "لنعمل معاً",
    "contact.name": "الاسم",
    "contact.email": "البريد الإلكتروني",
    "contact.message": "الرسالة",
    "contact.send": "إرسال الرسالة",
    "contact.sending": "جاري الإرسال...",

    // Auth
    "auth.login": "تسجيل الدخول",
    "auth.email": "البريد الإلكتروني",
    "auth.password": "كلمة المرور",
    "auth.loginButton": "دخول",
    "auth.loginSuccess": "تم تسجيل الدخول بنجاح!",
    "auth.loginError": "بيانات اعتماد غير صحيحة",
    "auth.logoutSuccess": "تم تسجيل الخروج بنجاح",

    // Common
    "common.loading": "جاري التحميل...",
    "common.error": "حدث خطأ ما",
    "common.success": "نجح!",
    "common.close": "إغلاق",
    "common.save": "حفظ",
    "common.cancel": "إلغاء",
    "common.delete": "حذف",
    "common.edit": "تعديل",
  },
}

const initialState: LanguageProviderState = {
  language: "en",
  setLanguage: () => null,
  t: () => "",
}

const LanguageProviderContext = createContext<LanguageProviderState>(initialState)

export function LanguageProvider({ children, defaultLanguage = "en" }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>(defaultLanguage)

  useEffect(() => {
    const storedLanguage = localStorage.getItem("portfolio-language") as Language
    if (storedLanguage) {
      setLanguage(storedLanguage)
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr"
    localStorage.setItem("portfolio-language", language)
  }, [language])

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  const value = {
    language,
    setLanguage: (lang: Language) => {
      setLanguage(lang)
    },
    t,
  }

  return <LanguageProviderContext.Provider value={value}>{children}</LanguageProviderContext.Provider>
}

export const useLanguage = () => {
  const context = useContext(LanguageProviderContext)

  if (context === undefined) throw new Error("useLanguage must be used within a LanguageProvider")

  return context
}
