import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bell, Calendar, Clock, ExternalLink, Search } from 'lucide-react'
import api from '../utils/api'

const categories = ['All', 'Engineering', 'Medical', 'Law', 'Management', 'Other']

function getDaysLeft(dateStr) {
  if (!dateStr) return null
  const diff = new Date(dateStr) - new Date()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export default function ExamAlerts({ initialTab = 'All Alerts' }) {
  const [exams, setExams] = useState([])
  const [filtered, setFiltered] = useState([])
  const [category, setCategory] = useState('All')
  const [activeTab, setActiveTab] = useState(initialTab)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setActiveTab(initialTab)
  }, [initialTab]);

  useEffect(() => {
    api.get('/exams').then(r => { setExams(r.data); setFiltered(r.data) }).catch(() => { }).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    let data = exams
    if (activeTab !== 'All Alerts') data = data.filter(e => (e.alert_type || 'Exam Alert') === activeTab)
    if (category !== 'All') data = data.filter(e => e.category === category)
    if (search) data = data.filter(e => e.name.toLowerCase().includes(search.toLowerCase()) || e.description?.toLowerCase().includes(search.toLowerCase()))
    setFiltered(data)
  }, [category, activeTab, search, exams])

  return (
    <div className="">
      {/* Header */}
      <section className="pt-20 pb-10 border-b-2 bg-gradient-to-br from-primary-50 to-blue-50 text-center relative overflow-hidden dotted-bg">
        <div className="absolute inset-0"><div className="absolute top-10 left-10 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow"></div></div>
        <div className="relative max-w-3xl mx-auto px-4">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 bg-primary-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Bell size={30} className="text-white animate-float" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-5xl font-bold text-secondary-900 mb-4">
            India's Top <span className="text-gradient">Updates & Alerts</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-secondary-600 text-xl">
            Stay ahead with real-time notifications for every major exam, scholarship, and internship in India.
          </motion.p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b border-primary-100 sticky top-[68px] z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Level Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {['All Alerts', 'Exam Alert', 'Scholarship', 'Government Internship'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${activeTab === tab ? 'bg-secondary-900 text-white shadow-md scale-105' : 'bg-gray-100 text-secondary-600 hover:bg-gray-200'}`}>
                {tab}
              </button>
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-shrink-0">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search exams..." className="input-field pl-10 w-64" />
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map(cat => (
                <button key={cat} onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${category === cat ? 'bg-primary-gradient text-white shadow-md scale-105' : 'bg-primary-50 text-secondary-700 hover:bg-primary-100'
                    }`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Exam Cards */}
      <section className="py-12 pattern-bg min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-primary-400 border-t-transparent rounded-full animate-spin"></div></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">🔔</p>
              <p className="text-secondary-400 text-xl">No exams found. Try a different filter.</p>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((exam, i) => {
                const daysLeft = getDaysLeft(exam.last_date)
                const examDays = getDaysLeft(exam.exam_date)
                return (
                  <motion.div key={exam.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="card p-6 hover:border-l-4 hover:border-primary-500 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-primary-gradient rounded-xl flex items-center justify-center"><Bell size={20} className="text-white" /></div>
                      <div className="flex gap-2">
                        <span className="badge bg-secondary-100 text-secondary-700">{exam.alert_type || 'Exam Alert'}</span>
                        <span className="badge bg-primary-100 text-primary-700">{exam.category}</span>
                      </div>
                    </div>
                    <h3 className="font-display text-xl font-bold text-secondary-900 mb-2">{exam.name}</h3>
                    <p className="text-secondary-500 text-sm leading-relaxed mb-4">{exam.description}</p>
                    <div className="space-y-2 border-t border-primary-100 pt-4">
                      {exam.exam_date && (
                        <div className="flex items-center gap-2 text-sm text-secondary-600">
                          <Calendar size={15} className="text-primary-500" />
                          <span><strong>Exam Date:</strong> {new Date(exam.exam_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                      )}
                      {exam.last_date && (
                        <div className="flex items-center gap-2 text-sm">
                          <Clock size={15} className={daysLeft <= 7 ? 'text-red-500' : 'text-primary-500'} />
                          <span className={daysLeft <= 7 ? 'text-red-600 font-semibold' : 'text-secondary-600'}>
                            <strong>Last Date:</strong> {new Date(exam.last_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                            {daysLeft !== null && daysLeft > 0 && <span className={`ml-2 badge ${daysLeft <= 7 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>{daysLeft}d left</span>}
                            {daysLeft !== null && daysLeft <= 0 && <span className="ml-2 badge bg-gray-100 text-gray-500">Closed</span>}
                          </span>
                        </div>
                      )}
                      {exam.link && (
                        <a href={exam.link} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-primary-500 hover:text-primary-700 text-sm font-semibold mt-2 transition-colors">
                          <ExternalLink size={14} /> Official Website
                        </a>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}
