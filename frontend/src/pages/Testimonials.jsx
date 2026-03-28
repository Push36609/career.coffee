import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import api from '../utils/api'
import toast from 'react-hot-toast'

const fade = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }
const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', designation: '', message: '', rating: 5 })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    api.get('/testimonials').then(r => setTestimonials(r.data)).catch(() => { }).finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.post('/testimonials', form)
      toast.success('Thank you! Your testimonial is pending approval.')
      setForm({ name: '', designation: '', message: '', rating: 5 })
    } catch {
      toast.error('Failed to submit. Please try again.')
    } finally { setSubmitting(false) }
  }

  return (
    <div className="">
      <section className="py-20 bg-gradient-to-br from-primary-50 to-blue-50 text-center relative overflow-hidden dotted-bg">
        <div className="relative max-w-3xl mx-auto px-4">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-5xl font-bold text-secondary-900 mb- 4">
            Student <span className="text-gradient">Success Stories</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-secondary-600 text-xl">
            Real stories from students and parents we've had the privilege of guiding.
          </motion.p>
        </div>
      </section>

      <section className="py-20 pattern-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-primary-400 border-t-transparent rounded-full animate-spin"></div></div>
          ) : testimonials.length === 0 ? (
            <p className="text-center text-secondary-400 text-xl py-20">No testimonials yet. Be the first!</p>
          ) : (
            <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {testimonials.map(t => (
                <motion.div key={t.id} variants={fade} className="card p-6 flex flex-col">
                  <div className="flex gap-1 mb-3">{[...Array(t.rating || 5)].map((_, i) => <Star key={i} size={16} className="fill-primary-400 text-primary-400" />)}</div>
                  <p className="text-secondary-700 italic leading-relaxed flex-1 mb-5">"{t.message}"</p>
                  <div className="flex items-center gap-3 border-t border-primary-100 pt-4">
                    <div className="w-11 h-11 bg-primary-gradient rounded-full flex items-center justify-center text-white font-bold">{t.name[0]}</div>
                    <div>
                      <p className="font-semibold text-secondary-900 text-sm">{t.name}</p>
                      <p className="text-secondary-400 text-xs">{t.designation}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Submit Your Story */}
          <div className="max-w-2xl mx-auto card p-8">
            <h3 className="font-display text-2xl font-bold text-secondary-900 mb-1">Share Your Story</h3>
            <p className="text-secondary-500 text-sm mb-6">Inspire the next generation. Your story matters!</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Your Name *" className="input-field" />
                <input value={form.designation} onChange={e => setForm(p => ({ ...p, designation: e.target.value }))}
                  placeholder="Designation / Course (optional)" className="input-field" />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-secondary-600 text-sm font-medium">Rating:</span>
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} type="button" onClick={() => setForm(p => ({ ...p, rating: n }))}
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${form.rating >= n ? 'bg-primary-400 border-primary-400 text-white' : 'border-primary-200 text-primary-300'}`}>
                    ★
                  </button>
                ))}
              </div>
              <textarea required rows={4} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                placeholder="Share your experience with Caramel Career Coffee... *" className="input-field resize-none" />
              <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed">
                {submitting ? 'Submitting...' : 'Submit Testimonial ✨'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
