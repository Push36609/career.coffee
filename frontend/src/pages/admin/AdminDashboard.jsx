import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Calendar, FileText, MessageSquare, Bell, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import AdminLayout from './AdminLayout'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, appointments: 0, blogs: 0, testimonials: 0, contacts: 0, exams: 0 })
  const [appointments, setAppointments] = useState([])

  useEffect(() => {
    Promise.all([
      api.get('/auth/users'),
      api.get('/appointments'),
      api.get('/blogs/all'),
      api.get('/testimonials/all'),
      api.get('/contacts'),
      api.get('/exams'),
    ]).then(([u, a, b, t, c, e]) => {
      setStats({ users: u.data.length, appointments: a.data.length, blogs: b.data.length, testimonials: t.data.filter(x => x.approved === 0).length, contacts: c.data.length, exams: e.data.length })
      setAppointments(a.data.slice(0, 5))
    }).catch(() => {})
  }, [])

  const cards = [
    { label: 'Total Users', value: stats.users, icon: Users, color: 'from-primary-400 to-primary-600', path: '/admin/users' },
    { label: 'Appointments', value: stats.appointments, icon: Calendar, color: 'from-amber-400 to-orange-500', path: '/admin/appointments' },
    { label: 'Blog Posts', value: stats.blogs, icon: FileText, color: 'from-secondary-600 to-secondary-800', path: '/admin/blogs' },
    { label: 'Pending Reviews', value: stats.testimonials, icon: MessageSquare, color: 'from-purple-400 to-purple-600', path: '/admin/testimonials' },
    { label: 'Contact Messages', value: stats.contacts, icon: TrendingUp, color: 'from-green-400 to-emerald-600', path: '/admin/appointments' },
    { label: 'Exam Notifications', value: stats.exams, icon: Bell, color: 'from-blue-400 to-blue-600', path: '/admin/exams' },
  ]

  const statusColors = { pending: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-600', completed: 'bg-blue-100 text-blue-700' }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-secondary-900">Dashboard Overview</h2>
        <p className="text-secondary-500 text-sm mt-1">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {cards.map(card => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="card p-5 text-center group cursor-pointer hover:shadow-xl" onClick={() => {}}>
            <Link to={card.path}>
              <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                <card.icon size={22} className="text-white" />
              </div>
              <div className="font-display text-2xl font-bold text-secondary-900">{card.value}</div>
              <div className="text-secondary-500 text-xs mt-1 font-medium">{card.label}</div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent Appointments */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-bold text-secondary-900">Recent Appointments</h3>
            <Link to="/admin/appointments" className="text-primary-500 text-sm font-semibold hover:text-primary-700">View All →</Link>
          </div>
          {appointments.length === 0 ? (
            <p className="text-secondary-400 text-sm text-center py-8">No appointments yet</p>
          ) : (
            <div className="space-y-3">
              {appointments.map(a => (
                <div key={a.id} className="flex items-center justify-between p-3 bg-primary-50 rounded-xl">
                  <div>
                    <p className="font-semibold text-secondary-900 text-sm">{a.name}</p>
                    <p className="text-secondary-500 text-xs">{a.service} • {a.date || 'Date TBD'}</p>
                  </div>
                  <span className={`badge text-xs ${statusColors[a.status] || 'bg-gray-100 text-gray-600'}`}>{a.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card p-6">
          <h3 className="font-display text-lg font-bold text-secondary-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {[
              { label: '+ New Blog Post', path: '/admin/blogs', color: 'btn-primary' },
              { label: '+ Add Exam Alert', path: '/admin/exams', color: 'btn-outline' },
              { label: '+ Add User', path: '/admin/users', color: 'btn-outline' },
              { label: 'View Appointments', path: '/admin/appointments', color: 'btn-outline' },
              { label: 'Review Testimonials', path: '/admin/testimonials', color: 'btn-outline' },
            ].map(a => (
              <Link key={a.label} to={a.path} className={`${a.color} block text-center text-sm py-2.5`}>{a.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
