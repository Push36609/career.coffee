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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-secondary-900/95 backdrop-blur-md shadow-2xl' : 'bg-gradient-to-b from-secondary-900/80 to-transparent'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          {/* Logo */}
          <Link to="/gallery/logo.png" className="flex items-center gap-2 group">
            <div className="w-12 h-12 flex items-center justify-center transition-al l duration-300">
              <img src="./gallery/logo.png" alt="Career Coffee Logo" className="w-full h-full object-contain rounded-full" />
            </div>
            <div> 
              <div className="font-display text-lg font-bold text-white leading-tight">Career Coffee</div>
              <div className="text-primary-300 text-xs font-medium tracking-widest uppercase"></div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <div key={link.label} className="relative group"
                onMouseEnter={() => setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}>
                <Link to={link.path}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${location.pathname === link.path
                    ? 'text-primary-300 bg-white/10'
                    : 'text-white/80 hover:text-primary-300 hover:bg-white/10'
                    }`}>
                  {link.label}
                  {link.dropdown && <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />}
                </Link>
                {link.dropdown && activeDropdown === link.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 mt-1 w-52 bg-secondary-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                    {link.dropdown.map(d => (
                      <Link key={d.label} to={d.path}
                        className="block px-4 py-2.5 text-sm text-white/80 hover:text-primary-300 hover:bg-white/10 transition-colors">
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
                  <Link to="/admin" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-primary-300 hover:bg-white/10 transition-colors">
                    <LayoutDashboard size={16} /> Admin Panel
                  </Link>
                ) : (
                  <Link to="/dashboard" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-primary-300 hover:bg-white/10 transition-colors">
                    {/* <LayoutDashboard size={16} /> Dashboard */}
                  </Link>
                )}
                <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-white/10 transition-colors">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-sm text-white/70 hover:text-primary-300 transition-colors px-3 py-2">Login</Link>
            )}
            <Link to="/appointment" className="btn-primary text-sm py-2.5 px-5">
              Book Appointment
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors">
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-secondary-900/98 backdrop-blur-md border-t border-white/10">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(link => (
                <div key={link.label}>
                  <Link to={link.path} className="block px-3 py-2.5 rounded-lg text-white/80 hover:text-primary-300 hover:bg-white/10 font-medium transition-colors">
                    {link.label}
                  </Link>
                  {link.dropdown && (
                    <div className="pl-4 space-y-1 mt-1">
                      {link.dropdown.map(d => (
                        <Link key={d.label} to={d.path} className="block px-3 py-2 rounded-lg text-white/60 hover:text-primary-300 text-sm transition-colors">
                          {d.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-3 border-t border-white/10 space-y-2">
                {user ? (
                  <>
                    {user.role === 'admin' ? (
                      <Link to="/admin" className="block px-3 py-2 text-primary-300 font-medium">Admin Panel</Link>
                    ) : (
                      <Link to="/dashboard" className="block px-3 py-2 text-primary-300 font-medium">Dashboard</Link>
                    )}
                    <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-red-400 font-medium">Logout</button>
                  </>
                ) : (
                  <Link to="/login" className="block px-3 py-2 text-white/70 font-medium">Login</Link>
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
