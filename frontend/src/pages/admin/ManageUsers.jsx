import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, Copy, Eye, EyeOff, UserCheck } from 'lucide-react'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import AdminLayout from './AdminLayout'

export default function ManageUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ user_id: '', name: '', email: '', password: '', role: 'user' })
  const [creating, setCreating] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [showPassMap, setShowPassMap] = useState({})
  const [newCredentials, setNewCredentials] = useState(null)

  const fetchUsers = () => {
    api.get('/auth/users').then(r => setUsers(r.data)).catch(() => {}).finally(() => setLoading(false))
  }
  useEffect(fetchUsers, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    setCreating(true)
    try {
      const res = await api.post('/auth/register', form)
      toast.success(`User "${form.user_id}" created successfully!`)
      setNewCredentials(res.data.credentials)
      setForm({ user_id: '', name: '', email: '', password: '', role: 'user' })
      setShowForm(false)
      fetchUsers()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create user')
    } finally { setCreating(false) }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return
    try {
      await api.delete(`/auth/users/${id}`)
      toast.success('User deleted')
      setUsers(prev => prev.filter(u => u.id !== id))
    } catch (err) { toast.error(err.response?.data?.error || 'Delete failed') }
  }

  const copyToClipboard = (text) => { navigator.clipboard.writeText(text); toast.success('Copied!') }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-secondary-900">User Management</h2>
          <p className="text-secondary-500 text-sm mt-1">Create and manage user accounts with custom IDs and passwords.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> {showForm ? 'Cancel' : 'Add User'}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card p-6 mb-6 border-2 border-primary-300">
          <h3 className="font-display text-lg font-bold text-secondary-900 mb-4">Create New User</h3>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">User ID *</label>
              <input required value={form.user_id} onChange={e => setForm(p => ({ ...p, user_id: e.target.value }))}
                placeholder="e.g. student_001" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">Full Name *</label>
              <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="Full name" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">Email</label>
              <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="email@example.com" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">Password *</label>
              <input required value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                placeholder="Set a strong password" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">Role</label>
              <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} className="input-field">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex items-end">
              <button type="submit" disabled={creating} className="btn-primary w-full disabled:opacity-60">
                {creating ? 'Creating...' : <><UserCheck size={16} className="inline mr-2" />Create User</>}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* New Credentials Banner */}
      {newCredentials && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="card p-5 mb-6 border-2 border-green-400 bg-green-50">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-bold text-green-800 mb-2">✅ User Created! Share these credentials:</p>
              <div className="font-mono text-sm space-y-1">
                <p className="text-secondary-800">User ID: <strong className="text-green-700">{newCredentials.user_id}</strong>
                  <button onClick={() => copyToClipboard(newCredentials.user_id)} className="ml-2 text-green-600 hover:text-green-800"><Copy size={14} className="inline" /></button>
                </p>
                <p className="text-secondary-800">Password: <strong className="text-green-700">{newCredentials.password}</strong>
                  <button onClick={() => copyToClipboard(newCredentials.password)} className="ml-2 text-green-600 hover:text-green-800"><Copy size={14} className="inline" /></button>
                </p>
              </div>
            </div>
            <button onClick={() => setNewCredentials(null)} className="text-green-600 hover:text-green-800 text-lg">✕</button>
          </div>
        </motion.div>
      )}

      {/* Users Table */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-primary-100">
          <h3 className="font-semibold text-secondary-900">All Users ({users.length})</h3>
        </div>
        {loading ? (
          <div className="flex justify-center py-12"><div className="w-10 h-10 border-4 border-primary-400 border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-primary-50">
                <tr>
                  {['User ID', 'Name', 'Email', 'Role', 'Created', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-secondary-600 font-semibold text-xs uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-100">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-primary-50/50 transition-colors">
                    <td className="px-4 py-3"><code className="bg-primary-100 text-primary-700 px-2 py-0.5 rounded font-mono text-xs">{u.user_id}</code></td>
                    <td className="px-4 py-3 font-medium text-secondary-900">{u.name}</td>
                    <td className="px-4 py-3 text-secondary-600">{u.email || '—'}</td>
                    <td className="px-4 py-3"><span className={`badge text-xs ${u.role === 'admin' ? 'bg-primary-100 text-primary-700' : 'bg-blue-100 text-blue-700'}`}>{u.role}</span></td>
                    <td className="px-4 py-3 text-secondary-400 text-xs">{new Date(u.created_at).toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDelete(u.id, u.name)}
                        className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
