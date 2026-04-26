import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, Eye, EyeOff, Save, X } from 'lucide-react'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import AdminLayout from './AdminLayout'
import ReactQuill from 'react-quill'
import 'quill/dist/quill.snow.css'

const emptyBlog = { title: '', summary: '', content: '', category: '', published: 1 }
const categories = ['Career Guidance', 'Exam Alerts', 'Study Abroad', 'Admissions', 'Scholarships', 'News']

export default function ManageBlogs() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null) // null = hidden, 'new' = new, id = edit
  const [form, setForm] = useState(emptyBlog)
  const [saving, setSaving] = useState(false)

  const fetchBlogs = () => {
    api.get('/blogs/all').then(r => setBlogs(r.data)).catch(() => {}).finally(() => setLoading(false))
  }
  useEffect(fetchBlogs, [])

  const startEdit = (blog) => { setEditing(blog.id); setForm({ title: blog.title, summary: blog.summary || '', content: blog.content, category: blog.category || '', published: blog.published }) }
  const startNew = () => { setEditing('new'); setForm(emptyBlog) }
  const cancel = () => { setEditing(null); setForm(emptyBlog) }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing === 'new') {
        await api.post('/blogs', form)
        toast.success('Blog published!')
      } else {
        await api.put(`/blogs/${editing}`, form)
        toast.success('Blog updated!')
      }
      cancel(); fetchBlogs()
    } catch (err) { toast.error(err.response?.data?.error || 'Save failed') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return
    try { await api.delete(`/blogs/${id}`); toast.success('Blog deleted'); fetchBlogs() }
    catch { toast.error('Delete failed') }
  }

  const togglePublish = async (blog) => {
    try {
      await api.put(`/blogs/${blog.id}`, { ...blog, published: blog.published ? 0 : 1 })
      toast.success(blog.published ? 'Blog unpublished' : 'Blog published')
      fetchBlogs()
    } catch { toast.error('Failed') }
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-secondary-900">Blog Management</h2>
          <p className="text-secondary-500 text-sm mt-1">Write, edit, and manage your blog posts.</p>
        </div>
        <button onClick={startNew} className="btn-primary flex items-center gap-2"><Plus size={18} />New Blog</button>
      </div>

      {/* Editor */}
      {editing !== null && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card p-6 mb-6 border-2 border-primary-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-bold text-secondary-900">{editing === 'new' ? 'New Blog Post' : 'Edit Blog Post'}</h3>
            <button onClick={cancel} className="text-secondary-400 hover:text-secondary-700 p-1.5 rounded-lg hover:bg-primary-50"><X size={20} /></button>
          </div>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-secondary-700 mb-1">Blog Title *</label>
                <input required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Enter blog title..." className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Category</label>
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="input-field">
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Status</label>
                <select value={form.published} onChange={e => setForm(p => ({ ...p, published: Number(e.target.value) }))} className="input-field">
                  <option value={1}>Published</option>
                  <option value={0}>Draft</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-secondary-700 mb-1">Summary</label>
                <textarea rows={2} value={form.summary} onChange={e => setForm(p => ({ ...p, summary: e.target.value }))} placeholder="Short summary of the blog..." className="input-field resize-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-secondary-700 mb-1">Content *</label>
                <div className="bg-white rounded-xl overflow-hidden border border-primary-200">
                  <ReactQuill
                    theme="snow"
                    value={form.content}
                    onChange={val => setForm(p => ({ ...p, content: val }))}
                    placeholder="Write your blog content here..."
                    className="min-h-[300px]"
                    modules={{
                      toolbar: [
                        [{ 'header': [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        ['link', 'clean']
                      ]
                    }}
                  />
                </div>
                <p className="text-[10px] text-secondary-400 mt-1">Rich text editor enabled. Paste your content directly.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-60">
                <Save size={16} />{saving ? 'Saving...' : 'Save Blog'}
              </button>
              <button type="button" onClick={cancel} className="btn-ghost">Cancel</button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Blog List */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-primary-100">
          <h3 className="font-semibold text-secondary-900">All Blogs ({blogs.length})</h3>
        </div>
        {loading ? (
          <div className="flex justify-center py-12"><div className="w-10 h-10 border-4 border-primary-400 border-t-transparent rounded-full animate-spin"></div></div>
        ) : blogs.length === 0 ? (
          <p className="text-center text-secondary-400 py-12">No blogs yet. Create your first post!</p>
        ) : (
          <div className="divide-y divide-primary-100">
            {blogs.map(blog => (
              <div key={blog.id} className="flex items-start justify-between gap-4 p-4 hover:bg-primary-50/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-secondary-900 truncate">{blog.title}</h4>
                    <span className={`badge text-xs shrink-0 ${blog.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{blog.published ? 'Published' : 'Draft'}</span>
                    {blog.category && <span className="badge bg-primary-100 text-primary-700 text-xs shrink-0">{blog.category}</span>}
                  </div>
                  <p className="text-secondary-400 text-xs">{new Date(blog.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} • By {blog.author}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => togglePublish(blog)} title={blog.published ? 'Unpublish' : 'Publish'}
                    className="p-1.5 rounded-lg text-secondary-400 hover:text-primary-600 hover:bg-primary-50 transition-colors">
                    {blog.published ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <button onClick={() => startEdit(blog)} className="p-1.5 rounded-lg text-secondary-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(blog.id, blog.title)} className="p-1.5 rounded-lg text-secondary-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
