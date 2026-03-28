import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter, Youtube, Linkedin } from 'lucide-react'
import api from '../utils/api'
import toast from 'react-hot-toast'

const socials = [
  { icon: Facebook, label: 'Facebook', href: 'https://facebook.com', color: 'hover:bg-blue-600' },
  { icon: Instagram, label: 'Instagram', href: 'https://instagram.com/rebal_rockey_', color: 'hover:bg-pink-600' },
  { icon: Twitter, label: 'Twitter / X', href: 'https://twitter.com', color: 'hover:bg-sky-500' },
  { icon: Youtube, label: 'YouTube', href: 'https://youtube.com', color: 'hover:bg-red-600' },
  { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com', color: 'hover:bg-blue-700' },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '', method: 'email' })
  const [submitting, setSubmitting] = useState(false)
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const response = await api.post('/contacts', form)
      
      if (form.method === 'whatsapp') {
        const text = `*New Contact Inquiry*\n\n*Name:* ${form.name}\n*Email:* ${form.email}\n*Phone:* ${form.phone || 'N/A'}\n*Subject:* ${form.subject || 'N/A'}\n\n*Message:* ${form.message}`
        const whatsappUrl = `https://wa.me/917217797832?text=${encodeURIComponent(text)}`
        window.open(whatsappUrl, '_blank')
        toast.success("Ready to send on WhatsApp!")
      } else {
        toast.success("Message sent! We'll get back to you via email soon. ☕")
      }
      
      setForm({ name: '', email: '', phone: '', subject: '', message: '', method: 'email' })
    } catch (err) { 
      toast.error(err.response?.data?.error || 'Failed to send. Please try again.') 
    }
    finally { setSubmitting(false) }
  }

  return (
    <div className="">
      <section className="py-20 bg-gradient-to-br from-primary-50 to-blue-50 text-center relative overflow-hidden dotted-bg">
        <div className="relative max-w-3xl mx-auto px-4">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-5xl font-bold text-secondary-900 mb-4">
            Get In <span className="text-gradient">Touch</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-secondary-600 text-xl">
            Have questions? We're here to help. Reach out to us through any of these channels.
          </motion.p>
        </div>
      </section>

      <section className="py-16 pattern-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-10">
            {/* Info Panel */}
            <div className="lg:col-span-2 space-y-6">
              <div className="card p-6">
                <h3 className="font-display text-xl font-bold text-secondary-900 mb-4">Contact Info</h3>
                <div className="space-y-4">
                  {[
                    { icon: MapPin, text: 'Career Coffee, B-39, 1st Floor, Middle Circle, Connaught Place, New Delhi - 110001', label: 'Office Address' },
                    { icon: Phone, text: '+91 721 779 7832', label: 'Call & Helpline', href: 'tel:+917217797832' },
                    { icon: Phone, text: '+91 721 779 7832', label: 'WhatsApp Us', href: 'https://wa.me/917217797832', isWhatsApp: true },
                    { icon: Mail, text: 'info@careercoffee.in', label: 'Email Us', href: 'mailto:info@careercoffee.in' },
                  ].map(({ icon: Icon, text, label, href, isWhatsApp }) => (
                    <div key={label} className="flex items-start gap-3 group">
                      <div className={`w-10 h-10 ${isWhatsApp ? 'bg-green-500' : 'bg-primary-gradient'} rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                        <Icon size={18} className="text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-secondary-400 font-semibold uppercase tracking-wider mb-0.5">{label}</p>
                        {href ? (
                          <a href={href} target={isWhatsApp ? "_blank" : "_self"} rel={isWhatsApp ? "noopener noreferrer" : ""}
                            className="text-secondary-700 text-sm hover:text-primary-500 transition-colors font-medium">
                            {text}
                          </a>
                        ) : (
                          <p className="text-secondary-700 text-sm">{text}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock size={18} className="text-primary-500" />
                  <h3 className="font-display text-xl font-bold text-secondary-900">Office Hours</h3>
                </div>
                <div className="space-y-2 text-sm text-secondary-600">
                  {[['Monday – Friday', '9:00 AM – 7:00 PM'], ['Saturday', '9:00 AM – 5:00 PM'], ['Sunday', 'By Appointment Only']].map(([d, t]) => (
                    <div key={d} className="flex justify-between py-1.5 border-b border-primary-100 last:border-0">
                      <span className="font-medium">{d}</span><span className="text-primary-600">{t}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card p-6">
                <h3 className="font-display text-xl font-bold text-secondary-900 mb-4">Follow Us</h3>
                <div className="space-y-3">
                  {socials.map(({ icon: Icon, label, href, color }) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                      className={`flex items-center gap-3 p-3 rounded-xl bg-gray-50 ${color} hover:text-white transition-all duration-300 group`}>
                      <Icon size={20} className="text-secondary-400 group-hover:text-white transition-colors" />
                      <span className="text-secondary-700 group-hover:text-white font-medium text-sm transition-colors">{label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-3">
              <div className="card p-8">
                <h3 className="font-display text-2xl font-bold text-secondary-900 mb-6">Send Us a Message</h3>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div><label className="block text-sm font-medium text-secondary-700 mb-1.5">Full Name *</label><input required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Your name" className="input-field" /></div>
                    <div><label className="block text-sm font-medium text-secondary-700 mb-1.5">Email *</label><input required type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@email.com" className="input-field" /></div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div><label className="block text-sm font-medium text-secondary-700 mb-1.5">Phone</label><input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+91 98765 43210" className="input-field" /></div>
                    <div><label className="block text-sm font-medium text-secondary-700 mb-1.5">Subject</label><input value={form.subject} onChange={e => set('subject', e.target.value)} placeholder="How can we help?" className="input-field" /></div>
                  </div>
                  <div><label className="block text-sm font-medium text-secondary-700 mb-1.5">Message *</label><textarea required rows={6} value={form.message} onChange={e => set('message', e.target.value)} placeholder="Tell us about your query in detail..." className="input-field resize-none" /></div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-3 text-center">How should we receive your message? *</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button type="button" onClick={() => set('method', 'email')}
                        className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${form.method === 'email' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-100 text-secondary-500 hover:border-primary-200 hover:bg-gray-50'}`}>
                        <Mail size={18} />
                        <span className="font-semibold">Email Admin</span>
                      </button>
                      <button type="button" onClick={() => set('method', 'whatsapp')}
                        className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${form.method === 'whatsapp' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-100 text-secondary-500 hover:border-green-200 hover:bg-gray-50'}`}>
                        <Phone size={18} />
                        <span className="font-semibold">WhatsApp Admin</span>
                      </button>
                    </div>
                  </div>

                  <button type="submit" disabled={submitting} className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transform transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed ${form.method === 'whatsapp' ? 'bg-green-500 hover:bg-green-600' : 'btn-primary'}`}>
                    {submitting ? 'Processing...' : form.method === 'whatsapp' ? '📱 Send via WhatsApp' : '📧 Send via Email'}
                  </button>
                </form>
              </div>
              {/* Map Embed */}
              <div className="card overflow-hidden mt-6">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.815!2d77.220!3d28.6295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd36a39d91f1%3A0x6476100806443c2d!2sB-39%2C%20Middle%20Circle%2C%20Connaught%20Place%2C%20New%20Delhi%2C%20Delhi%20110001!5e0!3m2!1sen!2sin!4v1711200000000!5m2!1sen!2sin"
                  width="100%" height="250" style={{ border: 0 }} allowFullScreen loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade" title="Caramel Career Coffee Location"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
