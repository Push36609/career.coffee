import { useState, useEffect } from 'react'
import { Star, CheckCircle, Trash2, Clock } from 'lucide-react'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import AdminLayout from './AdminLayout'

export default function ManageTestimonials() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  const fetchTestimonials = () => {
    api.get('/testimonials/all').then(r => setTestimonials(r.data)).catch(() => {}).finally(() => setLoading(false))
  }
  useEffect(fetchTestimonials, [])

  const approve = async (id) => {
    try { await api.patch(`/testimonials/${id}/approve`); toast.success('Testimonial approved!'); fetchTestimonials() }
    catch { toast.error('Failed to approve') }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return
    try { await api.delete(`/testimonials/${id}`); toast.success('Deleted'); fetchTestimonials() }
    catch { toast.error('Delete failed') }
  }

  const filtered = filter === 'all' ? testimonials : testimonials.filter(t => filter === 'pending' ? t.approved === 0 : t.approved === 1)

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-secondary-900">Testimonials</h2>
        <p className="text-secondary-500 text-sm mt-1">Review and approve student testimonials before they appear on the website.</p>
      </div>

      <div className="flex gap-2 mb-6">
        {[['all', 'All', testimonials.length], ['pending', 'Pending', testimonials.filter(t => t.approved === 0).length], ['approved', 'Approved', testimonials.filter(t => t.approved === 1).length]].map(([key, label, count]) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === key ? 'bg-primary-gradient text-white shadow-md' : 'bg-white border border-primary-200 text-secondary-700 hover:border-primary-400'}`}>
            {label} ({count})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary-400 border-t-transparent rounded-full animate-spin"></div></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20"><p className="text-secondary-400">No testimonials found.</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(t => (
            <div key={t.id} className={`card p-5 ${t.approved === 0 ? 'border-2 border-yellow-300' : 'border border-green-300'}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex gap-1">{[...Array(t.rating || 5)].map((_, i) => <Star key={i} size={14} className="fill-primary-400 text-primary-400" />)}</div>
                <span className={`badge text-xs flex items-center gap-1 ${t.approved === 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                  {t.approved === 0 ? <><Clock size={11} />Pending</> : <><CheckCircle size={11} />Approved</>}
                </span>
              </div>
              <p className="text-secondary-700 italic text-sm leading-relaxed mb-4">"{t.message}"</p>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 bg-primary-gradient rounded-full flex items-center justify-center text-white font-bold text-sm">{t.name[0]}</div>
                <div>
                  <p className="font-semibold text-secondary-900 text-sm">{t.name}</p>
                  {t.designation && <p className="text-secondary-400 text-xs">{t.designation}</p>}
                </div>
              </div>
              <div className="flex gap-2">
                {t.approved === 0 && (
                  <button onClick={() => approve(t.id)} className="btn-primary flex-1 py-2 text-sm flex items-center justify-center gap-1.5">
                    <CheckCircle size={15} /> Approve
                  </button>
                )}
                <button onClick={() => handleDelete(t.id)} className="py-2 px-3 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors flex items-center gap-1 text-sm">
                  <Trash2 size={15} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
