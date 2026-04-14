import { Link } from "react-router-dom"
import { Home } from "lucide-react"
import { useLanguage } from "../contexts/LanguageContext"

const NotFound = () => {
    const { language } = useLanguage()
    const isArabic = language === "ar"

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-accent-50 to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-md w-full">
                {/* 404 Number */}
                <h1 className="text-9xl font-bold text-primary-900 dark:text-accent-300 mb-4 select-none">
                    404
                </h1>

                {/* Message */}
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {isArabic ? "الصفحة غير موجودة" : "Page Not Found"}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
                    {isArabic
                        ? "عذرًا، الصفحة التي تبحث عنها غير موجودة أو تم نقلها."
                        : "Sorry, the page you're looking for doesn't exist or has been moved."}
                </p>

                {/* Back to Home Button */}
                <Link
                    to="/"
                    className="btn-primary inline-flex items-center gap-2"
                >
                    <Home className="w-5 h-5" />
                    {isArabic ? "العودة للرئيسية" : "Back to Home"}
                </Link>
            </div>
        </div>
    )
}

export default NotFound
