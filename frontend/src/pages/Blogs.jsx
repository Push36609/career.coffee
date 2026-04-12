import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, ChevronRight, Search } from 'lucide-react'
import api from '../utils/api'

const fade = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }
const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }

const blogEmojis = { 'Career Guidance': '🎯', 'Exam Alerts': '🔔', 'Study Abroad': '✈️', 'Admissions': '🏛️', 'default': '📖' }

export default function Blogs() {
  const [blogs, setBlogs] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/blogs').then(r => { setBlogs(r.data); setFiltered(r.data) }).catch(() => { }).finally(() => setLoading(false))
  }, [])

  const categories = ['All', ...new Set(blogs.map(b => b.category).filter(Boolean))]

  useEffect(() => {
    let data = blogs
    if (category !== 'All') data = data.filter(b => b.category === category)
    if (search) data = data.filter(b =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.summary?.toLowerCase().includes(search.toLowerCase())
    )
    setFiltered(data)
  }, [category, search, blogs])

  return (
    <div className="">
      <section className="pt-28 pb-10 bg-gradient-to-br from-primary-50 to-blue-50 text-center relative overflow-hidden dotted-bg">
        <div className="relative max-w-3xl mx-auto px-4">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-5xl font-bold text-secondary-900 mb-4">
            Our <span className="text-gradient">Knowledge Hub</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-secondary-600 text-xl">
            Expert articles, career guides, exam updates, and study abroad tips.
          </motion.p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 bg-white border-b border-primary-100 sticky top-[68px] z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative">
            <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search blogs..." className="input-field pl-10 w-56" />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${category === cat ? 'bg-primary-gradient text-white shadow-md scale-105' : 'bg-primary-50 text-secondary-700 hover:bg-primary-100'
                  }`}>{cat}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 pattern-bg min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-primary-400 border-t-transparent rounded-full animate-spin"></div></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20"><p className="text-5xl mb-4">📝</p><p className="text-secondary-400 text-xl">No blogs found.</p></div>
          ) : (
            <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(blog => (
                <motion.div key={blog.id} variants={fade} className="card overflow-hidden group flex flex-col">
                  <div className="h-40 bg-primary-gradient flex items-center justify-center text-5xl">
                    {blogEmojis[blog.category] || blogEmojis.default}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    {blog.category && <span className="badge bg-primary-100 text-primary-700 mb-3 self-start">{blog.category}</span>}
                    <h2 className="font-display font-bold text-secondary-900 text-lg mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">{blog.title}</h2>
                    {blog.summary && <p className="text-secondary-500 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">{blog.summary}</p>}
                    <div className="flex items-center justify-between border-t border-primary-100 pt-4 mt-auto">
                      <div className="flex items-center gap-2 text-secondary-400 text-xs">
                        <Calendar size={14} />
                        {new Date(blog.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      <Link to={`/blogs/${blog.slug}`} className="flex items-center gap-1 text-primary-500 font-semibold text-sm hover:gap-2 transition-all">
                        Read More <ChevronRight size={16} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}
