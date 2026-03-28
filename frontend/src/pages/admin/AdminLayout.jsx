import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Coffee, LayoutDashboard, Users, FileText, Calendar, MessageSquare, LogOut, Menu, X, ExternalLink, Bell, GraduationCap, Briefcase } from 'lucide-react'

const navItems = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Users', path: '/admin/users', icon: Users },
  { label: 'Blogs', path: '/admin/blogs', icon: FileText },
  { label: 'Appointments', path: '/admin/appointments', icon: Calendar },
  { label: 'Testimonials', path: '/admin/testimonials', icon: MessageSquare },
  { label: 'Exam Alerts', path: '/admin/exams', icon: Bell },
  { label: 'Scholarships', path: '/admin/scholarships', icon: GraduationCap },
  { label: 'Internships', path: '/admin/internships', icon: Briefcase },
]

export default function AdminSidebar({ children }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-secondary-900 transform transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 flex flex-col`}>
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-gradient rounded-xl flex items-center justify-center">
              <Coffee size={20} className="text-white" />
            </div>
            <div>
              <p className="font-display font-bold text-white text-sm">Caramel Career</p>
              <p className="text-primary-400 text-xs">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* User info */}
        <div className="p-4 mx-4 mt-4 bg-white/10 rounded-xl mb-2">
          <div className="w-10 h-10 bg-primary-gradient rounded-full flex items-center justify-center text-white font-bold mb-2">{user?.name?.[0]}</div>
          <p className="text-white font-semibold text-sm">{user?.name}</p>
          <p className="text-primary-400 text-xs capitalize">{user?.role}</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ label, path, icon: Icon }) => (
            <Link key={path} to={path} onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                location.pathname === path ? 'bg-primary-gradient text-white shadow-lg' : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}>
              <Icon size={18} /> {label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 space-y-1">
          <a href="/" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white/60 hover:text-white text-sm transition-colors">
            <ExternalLink size={16} /> View Website
          </a>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 text-sm transition-colors">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-primary-100 px-6 py-4 flex items-center justify-between shadow-sm">
          <button onClick={() => setOpen(!open)} className="lg:hidden p-2 rounded-lg hover:bg-primary-50 transition-colors">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="hidden lg:block">
            <h1 className="font-display text-xl font-bold text-secondary-900">
              {navItems.find(n => n.path === location.pathname)?.label || 'Admin'}
            </h1>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <div className="text-right">
              <p className="text-sm font-semibold text-secondary-900">{user?.name}</p>
              <p className="text-xs text-secondary-400 capitalize">{user?.role}</p>
            </div>
            <div className="w-9 h-9 bg-primary-gradient rounded-full flex items-center justify-center text-white font-bold text-sm">{user?.name?.[0]}</div>
          </div>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
