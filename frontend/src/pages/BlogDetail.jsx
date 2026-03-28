import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, User, ArrowLeft, Tag } from 'lucide-react'
import api from '../utils/api'

export default function BlogDetail() {
  const { slug } = useParams()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/blogs/${slug}`).then(r => setBlog(r.data)).catch(() => { }).finally(() => setLoading(false))
  }, [slug])

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-20"><div className="w-12 h-12 border-4 border-primary-400 border-t-transparent rounded-full animate-spin"></div></div>
  if (!blog) return <div className="min-h-screen flex flex-col items-center justify-center pt-20"><p className="text-5xl mb-4">📄</p><p className="text-secondary-400 text-xl">Blog not found.</p><Link to="/blogs" className="btn-primary mt-6">Back to Blogs</Link></div>

  return (
    <div className="">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-blue-50 relative overflow-hidden dotted-bg">
        <div className="absolute inset-0"><div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"></div></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          <Link to="/blogs" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6 transition-colors">
            <ArrowLeft size={18} /> Back to Blogs
          </Link>
          {blog.category && (
            <div className="flex items-center gap-2 mb-4">
              <Tag size={16} className="text-primary-600" />
              <span className="text-primary-600 font-semibold text-sm">{blog.category}</span>
            </div>
          )}
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl lg:text-5xl font-bold text-secondary-900 mb-6 leading-tight">
            {blog.title}
          </motion.h1>
          <div className="flex flex-wrap items-center gap-6 text-secondary-600 text-sm">
            <div className="flex items-center gap-2"><User size={15} />{blog.author}</div>
            <div className="flex items-center gap-2"><Calendar size={15} />{new Date(blog.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-14 pattern-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {blog.summary && <p className="text-xl text-secondary-600 italic border-l-4 border-primary-500 pl-5 mb-10 leading-relaxed">{blog.summary}</p>}
          <article
            className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-secondary-900 prose-p:text-secondary-700 prose-p:leading-relaxed prose-li:text-secondary-700 prose-strong:text-secondary-900"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
          <div className="mt-12 pt-8 border-t border-primary-200 flex flex-col sm:flex-row items-center justify-between gap-6">
            <Link to="/blogs" className="btn-outline flex items-center gap-2"><ArrowLeft size={16} /> More Articles</Link>
            <Link to="/appointment" className="btn-primary">Book a Counselling Session →</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
