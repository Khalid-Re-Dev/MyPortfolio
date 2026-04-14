import { lazy, Suspense, useState } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// Contexts
import { ThemeProvider } from "./contexts/ThemeContext"
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext"
import { AuthProvider, useAuth } from "./contexts/AuthContext"

// Components (eagerly loaded — needed for the main page)
import Header from "./components/Header"
import Hero from "./components/Hero"
import About from "./components/About"
import Projects from "./components/Projects"
import Contact from "./components/Contact"
import Footer from "./components/Footer"
import PageLoader from "./components/PageLoader"

// Pages (lazy loaded — only fetched when their route is visited)
const Dashboard = lazy(() => import("./pages/Dashboard"))
const Login = lazy(() => import("./pages/Login"))
const NotFound = lazy(() => import("./pages/NotFound"))

/**
 * Full-viewport loading spinner used as Suspense fallback.
 * Supports dark mode via existing Tailwind dark: pattern.
 */
const SuspenseLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
    <div className="w-10 h-10 border-4 border-primary-900 dark:border-accent-300 border-t-transparent rounded-full animate-spin"></div>
  </div>
)

/**
 * ProtectedRoute — renders children only if authenticated.
 * While auth state is loading, shows a spinner to prevent flash.
 * If not authenticated, redirects to /login.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

/**
 * PublicOnlyRoute — renders children only if NOT authenticated.
 * Redirects authenticated users to /dashboard (no need to log in again).
 */
const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}



/**
 * Inner app component — lives inside all providers so hooks work.
 */
function AppContent() {
  const { isRTL } = useLanguage()
  const [isLoading, setIsLoading] = useState(true)

  return (
    <Router>
      <div className="App">
        {isLoading && <PageLoader onComplete={() => setIsLoading(false)} />}
        <Header />
        <Suspense fallback={<SuspenseLoader />}>
          <Routes>
            <Route
              path="/"
              element={
                <main>
                  <Hero />
                  <About />
                  <Projects />
                  <Contact />
                </main>
              }
            />
            <Route
              path="/login"
              element={
                <PublicOnlyRoute>
                  <Login />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <Footer />

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={isRTL}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    </Router>
  )
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App

