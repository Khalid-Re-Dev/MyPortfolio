"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/providers/auth-provider"
import { useRouter } from "next/navigation"
import { BarChart3, Users, MessageSquare, Eye, Plus } from "lucide-react"

interface AnalyticsData {
  projectViews: Record<string, number>
  totalSessions: number
  recentSessions: Array<{
    userId: string
    projectId: string
    timestamp: string
    userAgent: string
    ip: string
  }>
}

interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  timestamp: string
  read: boolean
}

export default function AdminDashboard() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/")
      return
    }

    if (user && user.role === "admin") {
      fetchAnalytics()
      fetchMessages()
    }
  }, [user, isLoading, router])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/analytics/project-view", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("portfolio-token")}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error)
    }
  }

  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/contact", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("portfolio-token")}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages)
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return null
  }

  const totalViews = analytics ? Object.values(analytics.projectViews).reduce((sum, views) => sum + views, 0) : 0
  const unreadMessages = messages.filter((m) => !m.read).length

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400">Welcome back, {user.name}</p>
            </div>
            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 bg-[var(--primary-navy)] text-white rounded-lg hover:bg-[#003366] transition-colors duration-200"
            >
              Back to Portfolio
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Views</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalViews}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Sessions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics?.totalSessions || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Messages</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{messages.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Unread</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{unreadMessages}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: "overview", name: "Overview", icon: BarChart3 },
                { id: "messages", name: "Messages", icon: MessageSquare },
                { id: "projects", name: "Projects", icon: Eye },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-[var(--primary-navy)] text-[var(--primary-navy)] dark:text-[var(--primary-light-blue)] dark:border-[var(--primary-light-blue)]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                >
                  <tab.icon size={16} />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Project Views</h3>
                {analytics && Object.keys(analytics.projectViews).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(analytics.projectViews).map(([projectId, views]) => (
                      <div
                        key={projectId}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <span className="font-medium text-gray-900 dark:text-white">Project {projectId}</span>
                        <span className="text-2xl font-bold text-[var(--primary-navy)] dark:text-[var(--primary-light-blue)]">
                          {views}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No project views yet.</p>
                )}

                <h3 className="text-lg font-medium text-gray-900 dark:text-white mt-8">Recent Sessions</h3>
                {analytics && analytics.recentSessions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Project
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Time
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            IP
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {analytics.recentSessions.map((session, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              User {session.userId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              Project {session.projectId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {new Date(session.timestamp).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {session.ip}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No recent sessions.</p>
                )}
              </div>
            )}

            {activeTab === "messages" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Contact Messages</h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{unreadMessages} unread</span>
                </div>
                {messages.length > 0 ? (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-4 rounded-lg border ${
                          message.read
                            ? "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                            : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">{message.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{message.email}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(message.timestamp).toLocaleString()}
                            </p>
                            {!message.read && (
                              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-1"></span>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{message.message}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No messages yet.</p>
                )}
              </div>
            )}

            {activeTab === "projects" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Project Management</h3>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-[var(--primary-navy)] text-white rounded-lg hover:bg-[#003366] transition-colors duration-200">
                    <Plus size={16} />
                    <span>Add Project</span>
                  </button>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Project management functionality would be implemented here. This would include:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 ml-4">
                  <li>Add new projects with images and details</li>
                  <li>Edit existing project information</li>
                  <li>Toggle project visibility (featured/hidden)</li>
                  <li>Upload and manage project images</li>
                  <li>View detailed analytics per project</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
