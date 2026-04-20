
import { useState, useEffect, useCallback } from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { useLanguage } from "../contexts/LanguageContext"
import { Users, FolderOpen, BarChart3, Plus, Edit, Trash2, Eye, RefreshCw, Loader2 } from "lucide-react"
import { toast } from "react-toastify"
import { fadeInUp, staggerAnimation } from "../utils/animations"
import api from "../utils/api"

const Dashboard = () => {
  const { user, isAuthenticated, isAdmin } = useAuth()
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState("overview")
  const [projects, setProjects] = useState([])
  const [users, setUsers] = useState([])
  const [analytics, setAnalytics] = useState({
    totalViews: 0,
    totalProjects: 0,
    totalUsers: 0,
    uniqueSessions: 0,
  })
  const [loading, setLoading] = useState(true)

  /* ── Fetch functions ── */
  const fetchProjects = useCallback(async () => {
    try {
      const res = await api.get("/projects?status=published&limit=50")
      // Also fetch drafts
      const resDraft = await api.get("/projects?status=draft&limit=50")
      const all = [...(res.data.projects || []), ...(resDraft.data.projects || [])]
      setProjects(all)
      return all.length
    } catch (err) {
      console.error("Fetch projects error:", err)
      return 0
    }
  }, [])

  const fetchUsers = useCallback(async () => {
    try {
      const res = await api.get("/users")
      setUsers(res.data.users || [])
      return (res.data.users || []).length
    } catch (err) {
      console.error("Fetch users error:", err)
      return 0
    }
  }, [])

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await api.get("/analytics/summary")
      return res.data
    } catch (err) {
      console.error("Fetch analytics error:", err)
      return null
    }
  }, [])

  const fetchDashboardData = useCallback(async () => {
    setLoading(true)
    const [projectCount, userCount, analyticsData] = await Promise.all([
      fetchProjects(),
      fetchUsers(),
      fetchAnalytics(),
    ])

    setAnalytics({
      totalViews: analyticsData?.totalVisits || 0,
      totalProjects: projectCount,
      totalUsers: userCount,
      uniqueSessions: analyticsData?.uniqueSessions || 0,
    })
    setLoading(false)
  }, [fetchProjects, fetchUsers, fetchAnalytics])

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fadeInUp(".dashboard-header", 0)
      fetchDashboardData()
    }
  }, [isAuthenticated, isAdmin, fetchDashboardData])

  useEffect(() => {
    if (!loading) {
      staggerAnimation(".dashboard-card", 100)
    }
  }, [loading, activeTab])

  /* ── Guards ── */
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-300">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  /* ── CRUD handlers ── */
  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return
    try {
      await api.delete(`/projects/${projectId}`)
      setProjects((prev) => prev.filter((p) => p._id !== projectId))
      setAnalytics((prev) => ({ ...prev, totalProjects: prev.totalProjects - 1 }))
      toast.success("Project deleted successfully")
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete project")
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return
    try {
      await api.delete(`/users/${userId}`)
      setUsers((prev) => prev.filter((u) => u._id !== userId))
      setAnalytics((prev) => ({ ...prev, totalUsers: prev.totalUsers - 1 }))
      toast.success("User deleted successfully")
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user")
    }
  }

  /* ── Tabs ── */
  const tabs = [
    { id: "overview", name: "Overview", icon: BarChart3 },
    { id: "projects", name: "Projects", icon: FolderOpen },
    { id: "users", name: "Users", icon: Users },
  ]

  const formatDate = (d) => {
    if (!d) return "—"
    return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="dashboard-header mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t("dashboard.title")}</h1>
            <p className="text-gray-600 dark:text-gray-300">Welcome back, {user?.name || "Admin"}</p>
          </div>
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="Refresh data"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin text-gray-500" /> : <RefreshCw className="w-5 h-5 text-gray-500" />}
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${activeTab === tab.id
                    ? "border-primary-900 text-primary-900 dark:text-accent-300"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="dashboard-card card p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <Eye className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Views</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {loading ? "..." : analytics.totalViews.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="dashboard-card card p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <FolderOpen className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Projects</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {loading ? "..." : analytics.totalProjects}
                    </p>
                  </div>
                </div>
              </div>

              <div className="dashboard-card card p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Users</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {loading ? "..." : analytics.totalUsers}
                    </p>
                  </div>
                </div>
              </div>

              <div className="dashboard-card card p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Unique Sessions</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {loading ? "..." : analytics.uniqueSessions}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Projects */}
            <div className="dashboard-card card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Projects</h3>
              {projects.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-sm">No projects yet. Add your first project from the Projects tab.</p>
              ) : (
                <div className="space-y-3">
                  {projects.slice(0, 5).map((p) => (
                    <div key={p._id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${p.status === "published" ? "bg-green-500" : "bg-yellow-500"}`} />
                        <span className="text-gray-700 dark:text-gray-300 text-sm">{p.title}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>{p.views || 0} views</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${p.status === "published" ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300" : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300"}`}>
                          {p.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Manage Projects ({projects.length})
              </h3>
            </div>

            {projects.length === 0 ? (
              <div className="dashboard-card card p-12 text-center">
                <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No projects found.</p>
              </div>
            ) : (
              <div className="dashboard-card card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Project</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Views</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      {projects.map((project) => (
                        <tr key={project._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{project.title}</div>
                            <div className="text-xs text-gray-400 truncate max-w-[200px]">{project.shortDescription}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-600 dark:text-gray-300">{project.category}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600 dark:text-gray-300">{project.views || 0}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${project.status === "published"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"}`}>
                              {project.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(project.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-3">
                              <button
                                onClick={() => handleDeleteProject(project._id)}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Manage Users ({users.length})
              </h3>
            </div>

            {users.length === 0 ? (
              <div className="dashboard-card card p-12 text-center">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No users found.</p>
              </div>
            ) : (
              <div className="dashboard-card card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Last Login</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Logins</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      {users.map((u) => (
                        <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{u.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{u.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${u.role === "admin"
                                ? "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                            {formatDate(u.lastLogin)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                            {u.loginCount || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-3">
                              {u.role !== "admin" && (
                                <button
                                  onClick={() => handleDeleteUser(u._id)}
                                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                              {u.role === "admin" && (
                                <span className="text-xs text-gray-400 italic">Protected</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
