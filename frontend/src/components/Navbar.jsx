import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Menu, X, Coffee, ChevronDown, LogOut, LayoutDashboard } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Services', path: '/services' },
  {
    label: 'Alerts',
    path: '/exam-alerts',
    dropdown: [
      { label: 'All Updates', path: '/exam-alerts' },
      { label: 'Scholarships', path: '/scholarships' },
      { label: 'Govt Internships', path: '/internships' }
    ]
  },
  { label: 'Blogs', path: '/blogs' },
  { label: 'Testimonials', path: '/testimonials' },
  { label: 'Contact', path: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location])

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-blue/95 backdrop-blur-md shadow-lg border-b border-gray-200' : 'bg-gradient-to-b from-white/80 to-transparent border-b border-gray-100'
      }`}>
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-22 py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-24 h-24 flex items-center justify-center transition-all duration-300">
              <img src="./gallery/logo.png" alt="Career Coffee Logo" className="w-full h-full rounded-full object-contain" />
            </div>
            <div>
              <div className="font-display text-3xl font-bold text-secondary-900 leading-tight">Career Coffee</div>
              <div className="text-primary-600 text-xs font-medium tracking-widest uppercase">The Unfiltered Career Discussion</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <div key={link.label} className="relative group"
                onMouseEnter={() => setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}>
                <Link to={link.path}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 ${location.pathname === link.path
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50'
                    }`}>
                  {link.label}
                  {link.dropdown && <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />}
                </Link>
                {link.dropdown && activeDropdown === link.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 mt-1 w-52 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                    {link.dropdown.map(d => (
                      <Link key={d.label} to={d.path}
                        className="block px-4 py-2.5 text-sm text-secondary-600 hover:text-primary-600 hover:bg-primary-50 transition-colors">
                        {d.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                {user.role === 'admin' ? (
                  <Link to="/admin" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-primary-600 hover:bg-primary-50 transition-colors">
                    <LayoutDashboard size={16} /> Admin Panel
                  </Link>
                ) : (
                  <Link to="/dashboard" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-primary-600 hover:bg-primary-5-50 transition-colors">
                    {/* <LayoutDashboard size={16} /> Dashboard */}
                  </Link>
                )}
                <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-sm text-secondary-600 hover:text-primary-600 transition-colors px-3 py-2">Login</Link>
            )}
            <Link to="/appointment" className="btn-primary text-sm py-2.5 px-5">
              Book Appointment
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-secondary-900 p-2 rounded-lg hover:bg-primary-50 transition-colors">
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white/98 backdrop-blur-md border-t border-gray-200">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(link => (
                <div key={link.label}>
                  <Link to={link.path} className="block px-3 py-2.5 rounded-lg text-secondary-600 hover:text-primary-600 hover:bg-primary-50 font-medium transition-colors">
                    {link.label}
                  </Link>
                  {link.dropdown && (
                    <div className="pl-4 space-y-1 mt-1">
                      {link.dropdown.map(d => (
                        <Link key={d.label} to={d.path} className="block px-3 py-2 rounded-lg text-secondary-500 hover:text-primary-600 text-sm transition-colors">
                          {d.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-3 border-t border-gray-200 space-y-2">
                {user ? (
                  <>
                    {user.role === 'admin' ? (
                      <Link to="/admin" className="block px-3 py-2 text-primary-600 font-medium">Admin Panel</Link>
                    ) : (
                      <Link to="/dashboard" className="block px-3 py-2 text-primary-600 font-medium">Dashboard</Link>
                    )}
                    <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-red-600 font-medium">Logout</button>
                  </>
                ) : (
                  <Link to="/login" className="block px-3 py-2 text-secondary-600 font-medium">Login</Link>
                )}
                <Link to="/appointment" className="btn-primary block text-center text-sm">Book Appointment</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
