import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, Video, FileText, CheckCircle, Clock3 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import { Link } from 'react-router-dom'

export default function UserDashboard() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/appointments/user')
      .then(r => setAppointments(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const pendingCount = appointments.filter(a => a.status === 'pending').length
  const confirmedCount = appointments.filter(a => a.status === 'confirmed').length
  const completedCount = appointments.filter(a => a.status === 'completed').length

  return (
    <div className="pt-20 min-h-screen bg-primary-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-secondary-900">Welcome, {user?.name}!</h1>
            <p className="text-secondary-500 mt-1 flex items-center gap-2">
              <span className="badge bg-primary-100 text-primary-700">User Dashboard</span>
              Track your career counselling journey
            </p>
          </div>
          <Link to="/appointment" className="btn-primary flex items-center justify-center gap-2 w-full md:w-auto">
            <Calendar size={18} /> Book New Session
          </Link>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6 border-l-4 border-yellow-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-500 text-sm font-medium">Pending Approvals</p>
                <p className="text-3xl font-display font-bold text-secondary-900 mt-1">{pendingCount}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-500"><Clock3 size={24} /></div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6 border-l-4 border-green-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-500 text-sm font-medium">Upcoming Sessions</p>
                <p className="text-3xl font-display font-bold text-secondary-900 mt-1">{confirmedCount}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-500"><Video size={24} /></div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6 border-l-4 border-blue-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-500 text-sm font-medium">Completed Sessions</p>
                <p className="text-3xl font-display font-bold text-secondary-900 mt-1">{completedCount}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500"><CheckCircle size={24} /></div>
            </div>
          </motion.div>
        </div>

        {/* Appointments List */}
        <div className="card overflow-hidden">
          <div className="p-6 border-b border-primary-100 flex items-center justify-between bg-white">
            <h2 className="font-display font-bold text-lg text-secondary-900 flex items-center gap-2">
              <FileText size={20} className="text-primary-500" /> My Appointments
            </h2>
          </div>

          <div className="p-0 bg-white min-h-[300px]">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="w-10 h-10 border-4 border-primary-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-20 px-4">
                <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-300">
                  <Calendar size={32} />
                </div>
                <h3 className="text-lg font-bold text-secondary-900 mb-2">No Appointments Yet</h3>
                <p className="text-secondary-500 max-w-sm mx-auto mb-6">You haven't booked any career counselling sessions yet. Start your journey today!</p>
                <Link to="/appointment" className="btn-primary inline-flex">Book a Session</Link>
              </div>
            ) : (
              <div className="divide-y divide-primary-100">
                {appointments.map((apt) => (
                  <div key={apt.id} className="p-6 hover:bg-primary-50/30 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-secondary-900 text-lg">{apt.service}</h3>
                        <span className={`badge text-xs ${apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                            apt.status === 'completed' ? 'bg-gray-100 text-gray-700' :
                              'bg-yellow-100 text-yellow-700'
                          }`}>
                          {apt.status === 'confirmed' ? 'Upcoming' : apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-secondary-500">
                        <div className="flex items-center gap-1.5"><Calendar size={14} className="text-primary-400" /> {new Date(apt.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</div>
                        <div className="flex items-center gap-1.5"><Clock size={14} className="text-primary-400" /> {apt.time}</div>
                        {apt.school_college && <div className="flex items-center gap-1.5"><CheckCircle size={14} className="text-primary-400" /> {apt.school_college}</div>}
                      </div>
                      {apt.message && <p className="text-sm text-secondary-400 mt-3 line-clamp-2 italic border-l-2 border-primary-200 pl-3">"{apt.message}"</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
