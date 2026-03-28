import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, X, Check, Bell, Image as ImageIcon, Link as LinkIcon, Calendar, Info } from 'lucide-react'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import AdminLayout from './AdminLayout'

export default function ManageExams({ alertType = 'Exam Alert', pageTitle = 'Manage Alerts', pageDesc = 'Add or update exam, scholarship, and internship alerts.' }) {
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingExam, setEditingExam] = useState(null)
  const [form, setForm] = useState({
    name: '',
    category: 'Engineering',
    alert_type: alertType,
    exam_date: '',
    last_date: '',
    description: '',
    link: '',
    active: 1
  })

  const alertTypes = ['Exam Alert', 'Scholarship', 'Government Internship']

  const categories = ['Engineering', 'Medical', 'Law', 'Management', 'Other']

  useEffect(() => {
    fetchExams()
    resetForm()
  }, [alertType])

  const fetchExams = async () => {
    try {
      const res = await api.get('/exams')
      setExams(res.data.filter(e => (e.alert_type || 'Exam Alert') === alertType))
    } catch (err) {
      toast.error('Failed to fetch exams')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editingExam) {
        await api.put(`/exams/${editingExam.id}`, form)
        toast.success('Exam updated successfully')
      } else {
        await api.post('/exams', form)
        toast.success('Exam added successfully')
      }
      setShowModal(false)
      setEditingExam(null)
      resetForm()
      fetchExams()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save exam')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this exam?')) return
    try {
      await api.delete(`/exams/${id}`)
      toast.success('Exam deleted')
      fetchExams()
    } catch (err) {
      toast.error('Failed to delete exam')
    }
  }

  const resetForm = () => {
    setForm({
      name: '',
      category: 'Engineering',
      alert_type: alertType,
      exam_date: '',
      last_date: '',
      description: '',
      link: '',
      image_url: '',
      active: 1
    })
  }

  const openEdit = (exam) => {
    setEditingExam(exam)
    setForm({
      name: exam.name || '',
      category: exam.category || 'Engineering',
      alert_type: exam.alert_type || alertType,
      exam_date: exam.exam_date || '',
      last_date: exam.last_date || '',
      description: exam.description || '',
      link: exam.link || '',
      image_url: exam.image_url || '',
      active: exam.active
    })
    setShowModal(true)
  }

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="font-display text-2xl font-bold text-secondary-900">{pageTitle}</h2>
          <p className="text-secondary-500 text-sm mt-1">{pageDesc}</p>
        </div>
        <button onClick={() => { resetForm(); setEditingExam(null); setShowModal(true) }}
          className="btn-primary flex items-center justify-center gap-2 py-2.5 px-6 shadow-lg shadow-primary-500/20">
          <Plus size={18} /> Add New {alertType === 'Exam Alert' ? 'Exam' : alertType === 'Scholarship' ? 'Scholarship' : 'Internship'}
        </button>
      </div>

      {loading && exams.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-primary-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-secondary-400 animate-pulse">Loading exams...</p>
        </div>
      ) : exams.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell size={28} className="text-primary-400" />
          </div>
          <h3 className="font-display text-lg font-bold text-secondary-900 mb-2">No {pageTitle} Found</h3>
          <p className="text-secondary-500 max-w-sm mx-auto mb-6">Start by adding an upcoming {alertType.toLowerCase() === 'exam alert' ? 'exam' : alertType.toLowerCase()} to alert your students.</p>
          <button onClick={() => { resetForm(); setEditingExam(null); setShowModal(true) }} className="btn-outline py-2 px-6">Add First {alertType === 'Exam Alert' ? 'Exam' : alertType}</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map(exam => (
            <motion.div key={exam.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="card group overflow-hidden border-transparent hover:border-primary-100 transition-all">
              <div className="relative p-5 bg-primary-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur shadow-sm rounded-full text-[10px] font-bold uppercase tracking-wider text-secondary-600">
                    {exam.alert_type || 'Exam Alert'} • {exam.category}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(exam)} className="p-1.5 bg-white shadow rounded-lg text-primary-600 hover:bg-primary-500 hover:text-white transition-all">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(exam.id)} className="p-1.5 bg-white shadow rounded-lg text-red-600 hover:bg-red-500 hover:text-white transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <h4 className="font-display font-bold text-secondary-900 mb-2 line-clamp-1">{exam.name}</h4>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-secondary-500">
                    <Calendar size={14} className="text-primary-400" />
                    <span>Exam: <span className="font-medium text-secondary-700">{exam.exam_date || 'TBD'}</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-secondary-500">
                    < Bell size={14} className="text-amber-400" />
                    <span>Deadline: <span className="font-medium text-secondary-700">{exam.last_date || 'TBD'}</span></span>
                  </div>
                </div>
                <p className="text-xs text-secondary-400 line-clamp-2 leading-relaxed mb-4">{exam.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-secondary-50">
                   <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${exam.active ? 'bg-green-500' : 'bg-red-400'}`}></div>
                    <span className="text-[10px] font-bold uppercase tracking-tight text-secondary-400">{exam.active ? 'Active' : 'Archived'}</span>
                   </div>
                   {exam.link && (
                    <a href={exam.link} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-primary-500 hover:underline flex items-center gap-1">
                      Link <LinkIcon size={12} />
                    </a>
                   )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-secondary-900/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
              
              <div className="px-8 py-6 border-b border-secondary-50 flex items-center justify-between bg-primary-gradient">
                <div>
                  <h3 className="font-display text-xl font-bold text-white">{editingExam ? `Edit ${alertType}` : `Add New ${alertType}`}</h3>
                  <p className="text-white/70 text-sm">Fill in the details for the {alertType.toLowerCase() === 'exam alert' ? 'exam' : alertType.toLowerCase()}.</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 text-white/50 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-8 space-y-6 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-secondary-700 text-sm font-bold mb-2 flex items-center gap-2">
                      <Bell size={16} className="text-primary-500" /> Title / Name
                    </label>
                    <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. JEE Main 2025"
                      className="w-full px-4 py-3 rounded-xl bg-secondary-50 border border-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white transition-all" />
                  </div>

                  <div>
                    <label className="block text-secondary-700 text-sm font-bold mb-2 flex items-center gap-2">
                      <Info size={16} className="text-primary-500" /> Category
                    </label>
                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-secondary-50 border border-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white transition-all appearance-none">
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-secondary-700 text-sm font-bold mb-2 flex items-center gap-2">
                      <Calendar size={16} className="text-primary-500" /> Exam Date
                    </label>
                    <input type="date" value={form.exam_date} onChange={e => setForm({ ...form, exam_date: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-secondary-50 border border-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white transition-all" />
                  </div>

                  <div>
                    <label className="block text-secondary-700 text-sm font-bold mb-2 flex items-center gap-2 text-amber-600">
                      <Bell size={16} /> Application Deadline
                    </label>
                    <input type="date" value={form.last_date} onChange={e => setForm({ ...form, last_date: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-secondary-50 border border-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white transition-all" />
                  </div>

                  <div>
                    <label className="block text-secondary-700 text-sm font-bold mb-2 flex items-center gap-2">
                      <LinkIcon size={16} className="text-primary-500" /> Official Link
                    </label>
                    <input value={form.link} onChange={e => setForm({ ...form, link: e.target.value })}
                      placeholder="https://exam-portal.gov.in"
                      className="w-full px-4 py-3 rounded-xl bg-secondary-50 border border-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white transition-all" />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-secondary-700 text-sm font-bold mb-2 flex items-center gap-2">
                      <FileText size={16} className="text-primary-500" /> Description
                    </label>
                    <textarea rows="4" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                      placeholder="Short overview of the exam, eligibility, and purpose..."
                      className="w-full px-4 py-3 rounded-xl bg-secondary-50 border border-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white transition-all resize-none"></textarea>
                  </div>

                  <div className="md:col-span-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" checked={form.active === 1} onChange={e => setForm({ ...form, active: e.target.checked ? 1 : 0 })}
                        className="w-5 h-5 rounded border-secondary-300 text-primary-500 focus:ring-primary-500 transition-all cursor-pointer" />
                      <div>
                        <span className="text-sm font-bold text-secondary-700 group-hover:text-primary-600 transition-colors">Active Status</span>
                        <p className="text-[10px] text-secondary-400 tracking-wide uppercase">Uncheck to archive this exam alert from the public website</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-secondary-50 flex gap-4">
                  <button type="button" onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-3.5 rounded-2xl bg-secondary-50 text-secondary-600 font-bold hover:bg-secondary-100 transition-all">
                    Cancel
                  </button>
                  <button type="submit" disabled={loading}
                    className="flex-[2] btn-primary py-3.5 flex items-center justify-center gap-2 disabled:opacity-50">
                    {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : editingExam ? <><Check size={20} /> Update {alertType}</> : <><Plus size={20} /> Save {alertType}</>}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  )
}

function FileText({ size, className }) {
  return <Bell size={size} className={className} /> // Placeholder for consistency if Lucide-react doesn't have it or needs it
}
