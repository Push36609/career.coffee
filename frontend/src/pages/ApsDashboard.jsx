import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bell, Calendar, Clock, ExternalLink, School } from 'lucide-react'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'

export default function ApsDashboard() {
  const { user } = useAuth()
  const [exams, setExams] = useState([])
  const [filter, setFilter] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/aps-exams')
      .then(res => setExams(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const filtered = exams.filter(e =>
    filter === 'All' || !e.stream || e.stream.toUpperCase() === filter
  )

  const getStreamLabel = (stream) => {
    if (!stream) return null
    const s = stream.toUpperCase()
    if (s === 'PCM') return { label: 'Engineering', color: 'bg-blue-100 text-blue-700' }
    if (s === 'PCB') return { label: 'Medical / Biology', color: 'bg-green-100 text-green-700' }
    return { label: stream, color: 'bg-gray-100 text-gray-600' }
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <section className="pt-36 pb-12 bg-gradient-to-br from-blue-50 to-primary-100 border-b border-primary-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/gallery/pattern.svg')] opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center shadow-lg">
              <School size={32} className="text-white" />
            </div>
            <div>
              <h1 className="font-display text-4xl font-bold mb-1 text-secondary-900">Career Alert — APS Dhaula Kuan</h1>
              <p className="text-primary-700 text-lg font-medium">Exclusive Dashboard for {user?.name}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Controls */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4">

          {/* Filter + count row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h2 className="text-2xl font-bold text-secondary-900">Upcoming Entrance Exams</h2>
            <div className="flex items-center gap-2 flex-wrap">
              {['All', 'PCM', 'PCB'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${filter === f
                    ? f === 'PCM' ? 'bg-blue-600 text-white shadow-md scale-105'
                      : f === 'PCB' ? 'bg-green-600 text-white shadow-md scale-105'
                        : 'bg-secondary-900 text-white shadow-md scale-105'
                    : 'bg-white border border-gray-200 text-secondary-600 hover:bg-gray-50'
                    }`}
                >
                  {f === 'All' ? '📋 All Exams' : f === 'PCM' ? '🔵 PCM' : '🟢 PCB'}
                </button>
              ))}
              <span className="badge bg-primary-100 text-primary-700 text-sm font-semibold px-4 py-1.5">
                {filtered.length} Exams
              </span>
            </div>
          </div>

          {/* Cards Grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-primary-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-secondary-400">
              <School size={52} className="mx-auto mb-4 text-primary-200" />
              <p className="text-lg font-medium">No exam alerts uploaded yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((exam, i) => {
                const streamMeta = getStreamLabel(exam.stream)
                return (
                  <motion.div
                    key={exam.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col p-5"
                  >
                    {/* Top Row: icon + badges */}
                    <div className="flex items-start justify-between mb-4">
                      {/* Bell Icon */}
                      <div className="w-11 h-11 bg-primary-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow">
                        <Bell size={20} className="text-white" />
                      </div>

                      {/* Badges */}
                      <div className="flex items-center gap-1.5 flex-wrap justify-end">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                          Exam Alert
                        </span>
                        {streamMeta && (
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${streamMeta.color} border-transparent`}>
                            {streamMeta.label}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Exam Name */}
                    <h3 className="font-display text-lg font-bold text-secondary-900 mb-2 leading-snug">
                      {exam.exam_name}
                    </h3>

                    {/* Description — colleges + courses */}
                    {(exam.colleges || exam.courses) && (
                      <p className="text-sm text-secondary-500 leading-relaxed mb-4 flex-1">
                        {exam.colleges
                          ? `${exam.colleges}.`
                          : ''}
                        {exam.courses
                          ? ` Courses: ${exam.courses}.`
                          : ''}
                      </p>
                    )}

                    <div className="border-t border-gray-100 pt-3 mt-auto space-y-2">
                      {/* Exam Period */}
                      {exam.exam_period && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar size={14} className="text-primary-500 flex-shrink-0" />
                          <span className="text-secondary-500 font-medium">Exam Period:</span>
                          <span className="text-secondary-800 font-semibold">{exam.exam_period}</span>
                        </div>
                      )}

                      {/* Application Window */}
                      {exam.app_window && (
                        <div className="flex items-center gap-2 text-sm flex-wrap">
                          <Clock size={14} className="text-red-400 flex-shrink-0" />
                          <span className="text-secondary-500 font-medium">Apply By:</span>
                          <span className="text-red-500 font-semibold">{exam.app_window}</span>
                        </div>
                      )}

                      {/* Website */}
                      {exam.website ? (
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <a
                            href={exam.website.startsWith('http') ? exam.website : `https://${exam.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-primary-600 hover:text-primary-700 font-semibold text-sm transition-colors flex-shrink-0"
                          >
                            <ExternalLink size={14} />
                            Official Website
                          </a>
                          <span className="text-secondary-300 text-xs">|</span>
                          <a
                            href={exam.website.startsWith('http') ? exam.website : `https://${exam.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-secondary-400 hover:text-primary-500 text-xs truncate max-w-[160px] transition-colors"
                            title={exam.website}
                          >
                            {exam.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                          </a>
                        </div>
                      ) : (
                        <p className="text-secondary-300 text-sm mt-1">No website available</p>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
