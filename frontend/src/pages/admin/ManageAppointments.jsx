import { useState, useEffect } from 'react'
import { Trash2, CheckCircle, Clock, XCircle } from 'lucide-react'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import AdminLayout from './AdminLayout'

const statusColors = {
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock },
  confirmed: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
  completed: { bg: 'bg-blue-100', text: 'text-blue-700', icon: CheckCircle },
  cancelled: { bg: 'bg-red-100', text: 'text-red-600', icon: XCircle },
}

export default function ManageAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  const fetchAppointments = () => {
    api.get('/appointments').then(r => setAppointments(r.data)).catch(() => {}).finally(() => setLoading(false))
  }
  useEffect(fetchAppointments, [])

  const updateStatus = async (id, status) => {
    try { await api.patch(`/appointments/${id}`, { status }); toast.success(`Status updated to "${status}"`); fetchAppointments() }
    catch { toast.error('Update failed') }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this appointment?')) return
    try { await api.delete(`/appointments/${id}`); toast.success('Appointment deleted'); fetchAppointments() }
    catch { toast.error('Delete failed') }
  }

  const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter)
  const counts = { all: appointments.length, pending: appointments.filter(a => a.status === 'pending').length, confirmed: appointments.filter(a => a.status === 'confirmed').length, completed: appointments.filter(a => a.status === 'completed').length, cancelled: appointments.filter(a => a.status === 'cancelled').length }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-secondary-900">Appointments</h2>
        <p className="text-secondary-500 text-sm mt-1">Manage all booking requests from students and parents.</p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(counts).map(([key, count]) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${
              filter === key ? 'bg-primary-gradient text-white shadow-md' : 'bg-white text-secondary-700 border border-primary-200 hover:border-primary-400'
            }`}>
            {key} ({count})
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12"><div className="w-10 h-10 border-4 border-primary-400 border-t-transparent rounded-full animate-spin"></div></div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-secondary-400 py-12">No appointments found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-primary-50">
                <tr>
                  {['Name', 'Email', 'Phone', 'Service', 'School/College', 'Date & Time', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-secondary-600 font-semibold text-xs uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-100">
                {filtered.map(a => {
                  const sc = statusColors[a.status] || statusColors.pending
                  const Icon = sc.icon
                  return (
                    <tr key={a.id} className="hover:bg-primary-50/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-secondary-900 whitespace-nowrap">{a.name}</td>
                      <td className="px-4 py-3 text-secondary-600">{a.email}</td>
                      <td className="px-4 py-3 text-secondary-500">{a.phone || '—'}</td>
                      <td className="px-4 py-3 text-secondary-700 max-w-[150px] truncate">{a.service || '—'}</td>
                      <td className="px-4 py-3 text-secondary-700 max-w-[150px] truncate">{a.school_college || '—'}</td>
                      <td className="px-4 py-3 text-secondary-500 whitespace-nowrap text-xs">
                        {a.date || '—'} {a.time && `@ ${a.time}`}
                      </td>
                      <td className="px-4 py-3">
                        <select value={a.status} onChange={e => updateStatus(a.id, e.target.value)}
                          className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer ${sc.bg} ${sc.text} focus:outline-none focus:ring-2 focus:ring-primary-400`}>
                          {['pending', 'confirmed', 'completed', 'cancelled'].map(s => <option key={s} value={s} className="bg-white text-secondary-900 capitalize">{s}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleDelete(a.id)} className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
