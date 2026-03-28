import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import { Calendar, Clock, CheckCircle, Coffee } from 'lucide-react'
import api from '../utils/api'
import toast from 'react-hot-toast'

const services = [
  'Career Counselling', 'Workshops', 'College Admissions (India)', 'Study Abroad',
  , 'Compliance Guidance', 'Psychometric Assessment'
]
const timeSlots = ['10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM', '05:00 PM', '06:00 PM']

export default function Appointment() {
  const { user } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', school_college: '', service: '', date: '', time: '', message: '' })

  useEffect(() => {
    if (user) {
      setForm(p => ({ ...p, name: user.name || p.name, email: user.email || p.email, phone: user.phone || p.phone, address: user.address || p.address }))
    }
  }, [user])
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const setField = (field, val) => setForm(p => ({ ...p, [field]: val }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.post('/appointments', form)
      setSuccess(true)
      toast.success('Appointment booked successfully!')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong. Please try again.')
    } finally { setSubmitting(false) }
  }

  if (success) return (
    <div className="min-h-screen pt-20 flex items-center justify-center pattern-bg">
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card max-w-md w-full p-10 text-center mx-4">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={44} className="text-green-500" />
        </div>
        <h2 className="font-display text-3xl font-bold text-secondary-900 mb-3">Appointment Booked!</h2>
        <p className="text-secondary-500 mb-2">Thank you, <strong>{form.name}</strong>!</p>
        <p className="text-secondary-500 mb-6">We'll contact you at <strong>{form.email}</strong> within 24 hours to confirm your session.</p>
        <div className="bg-primary-50 rounded-xl p-4 mb-6 text-left space-y-2">
          {form.service && <p className="text-sm text-secondary-700"><strong>Service:</strong> {form.service}</p>}
          {form.date && <p className="text-sm text-secondary-700"><strong>Preferred Date:</strong> {new Date(form.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>}
          {form.time && <p className="text-sm text-secondary-700"><strong>Preferred Time:</strong> {form.time}</p>}
        </div>
        <button onClick={() => { setSuccess(false); setForm({ name: '', email: '', phone: '', address: '', school_college: '', service: '', date: '', time: '', message: '' }) }}
          className="btn-primary w-full">Book Another Appointment</button>
      </motion.div>
    </div>
  )

  return (
    <div className="">
      <section className="py-20 bg-secondary-gradient text-center relative overflow-hidden">
        <div className="absolute inset-0"><div className="absolute -top-20 -right-20 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow"></div></div>
        <div className="relative max-w-3xl mx-auto px-4">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-5xl font-bold text-white mb-4">
            Book an <span className="text-gradient">Appointment</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-white/70 text-xl">
            Schedule a free 30-minute consultation with our expert career counsellors.
          </motion.p>
        </div>
      </section>

      <section className="py-16 pattern-bg">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-8 md:p-10">
            <h2 className="font-display text-2xl font-bold text-secondary-900 mb-6">Fill Your Details</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1.5">Full Name *</label>
                  <input required value={form.name} onChange={e => setField('name', e.target.value)} placeholder="Your full name" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1.5">Email Address *</label>
                  <input required type="email" value={form.email} onChange={e => setField('email', e.target.value)} placeholder="you@email.com" className="input-field" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1.5">Phone Number</label>
                  <input value={form.phone} onChange={e => setField('phone', e.target.value)} placeholder="+91 98765 43210" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1.5">City / Address</label>
                  <input value={form.address} onChange={e => setField('address', e.target.value)} placeholder="Where are you from?" className="input-field" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1.5">School / College Name</label>
                <input value={form.school_college} onChange={e => setField('school_college', e.target.value)} placeholder="Enter your school or college name" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Select Service *</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {services.map(s => (
                    <button type="button" key={s} onClick={() => setField('service', s)}
                      className={`p-2.5 rounded-xl border-2 text-xs font-medium text-left transition-all duration-200 ${form.service === s ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-primary-200 text-secondary-600 hover:border-primary-400'
                        }`}>{s}</button>
                  ))}
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1.5"><Calendar size={15} className="inline mr-1" />Preferred Date</label>
                  <input type="date" value={form.date} onChange={e => setField('date', e.target.value)}
                    min={new Date().toISOString().split('T')[0]} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1.5"><Clock size={15} className="inline mr-1" />Preferred Time</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {timeSlots.slice(0, 6).map(t => (
                      <button type="button" key={t} onClick={() => setField('time', t)}
                        className={`py-1.5 rounded-lg text-xs font-medium border transition-all ${form.time === t ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-primary-200 text-secondary-600 hover:border-primary-400'
                          }`}>{t}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1.5">Additional Message</label>
                <textarea rows={3} value={form.message} onChange={e => setField('message', e.target.value)}
                  placeholder="Any specific concerns or questions you'd like to discuss..." className="input-field resize-none" />
              </div>
              <button type="submit" disabled={submitting || !form.name || !form.email} className="btn-primary w-full py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {submitting ? 'Booking...' : <><Coffee size={18} /> Book My Free Consultation</>}
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
