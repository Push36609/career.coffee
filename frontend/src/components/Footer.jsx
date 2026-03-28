import { Link } from 'react-router-dom'
import { Coffee, MapPin, Phone, Mail, Facebook, Instagram, Twitter, Youtube, Linkedin } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-white text-secondary-800 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
               <div className="w-112 h-112 flex items-center justify-center transition-all duration-300">
              <img src="./gallery/logo.png" alt="Career Coffee Logo" className="w-full h-full object-contain rounded-full" />
            </div>
              <div>
                <div className="font-display text-4xl font-bold">Career Coffee</div>
                
              </div>
            </div>
            <p className="text-secondary-600 text-sm leading-relaxed mb-5">
              Advanced career counselling services helping students, parents, and professionals navigate their path to success across India and abroad.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Facebook, href: 'https://facebook.com', color: 'hover:bg-blue-600' },
                { icon: Instagram, href: 'https://instagram.com/rebal_rockey_', color: 'hover:bg-pink-600' },
                { icon: Twitter, href: 'https://twitter.com', color: 'hover:bg-sky-500' },
                { icon: Youtube, href: 'https://youtube.com', color: 'hover:bg-red-600' },
                { icon: Linkedin, href: 'https://linkedin.com', color: 'hover:bg-blue-700' },
              ].map(({ icon: Icon, href, color }) => (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                  className={`w-9 h-9 bg-gray-200 rounded-lg flex items-center justify-center text-secondary-900 ${color} transition-all duration-300 hover:scale-110 hover:text-white`}>
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-primary-600 mb-4 text-lg">Quick Links</h4>
            <ul className="space-y-2.5">
              {[['Home', '/'], ['About Us', '/about'], ['Services', '/services'], ['Exam Alerts', '/exam-alerts'], ['Blogs', '/blogs'], ['Testimonials', '/testimonials'], ['Contact', '/contact']].map(([label, path]) => (
                <li key={path}>
                  <Link to={path} className="text-secondary-600 hover:text-primary-600 text-sm transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-primary-500 rounded-full group-hover:w-2 transition-all duration-300"></span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-semibold text-primary-600 mb-4 text-lg">Services</h4>
            <ul className="space-y-2.5">
              {['Career Counselling', 'School Counselling', 'College Admissions', 'Study Abroad', 'Students & Parents', 'Compliance Guidance', 'Exam Preparation', 'Psychometric Tests'].map(s => (
                <li key={s}>
                  <Link to="/services" className="text-secondary-600 hover:text-primary-600 text-sm transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-primary-500 rounded-full group-hover:w-2 transition-all duration-300"></span>
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-primary-600 mb-4 text-lg">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-primary-600 mt-0.5 shrink-0" />
                <p className="text-secondary-600 text-sm">Career Coffee, B-39, 1st Floor, Middle Circle, Connaught Place, New Delhi - 110001</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-primary-600 shrink-0" />
                <a href="tel:+917217797832" className="text-secondary-600 hover:text-primary-600 text-sm transition-colors">+91 721 779 7832</a>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-500 rounded-lg flex items-center justify-center shrink-0">
                  <Phone size={12} className="text-white" />
                </div>
                <a href="https://wa.me/917217797832" target="_blank" rel="noopener noreferrer" className="text-secondary-600 hover:text-green-600 text-sm transition-colors">WhatsApp Us</a>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-primary-600 shrink-0" />
                <a href="mailto:info@careercoffee.in" className="text-secondary-600 hover:text-primary-600 text-sm transition-colors">info@careercoffee.in</a>
              </div>
            </div>
            <div className="mt-5 p-4 bg-primary-50 border border-primary-200 rounded-xl">
              <p className="text-primary-700 text-xs font-semibold uppercase tracking-wider mb-1">Office Hours</p>
              <p className="text-secondary-600 text-sm">Mon – Sat: 9 AM – 7 PM</p>
              <p className="text-secondary-600 text-sm">Sunday: By Appointment</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-secondary-500 text-sm text-center">
            © {year} Career Coffee. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Sitemap'].map(t => (
              <a key={t} href="#" className="text-secondary-500 hover:text-primary-600 text-sm transition-colors">{t}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
