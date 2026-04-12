import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Star, Award, Users, BookOpen, Bell, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import api from '../utils/api'
import SocialGallery from '../components/SocialGallery.jsx'
import GoogleReviews from '../components/googlereview.jsx'
import AboutFounder from '../components/AboutFounder.jsx'

const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }
const container = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } }

const stats = [
  { value: '10000+', label: 'Students Counselled', icon: Users },
  { value: '98%', label: 'Effectiveness Rate', icon: Star },
  { value: '50+', label: 'Partner Institutions', icon: Award },
  { value: '13+', label: 'Years Experience', icon: BookOpen },
]

const services = [
  { title: 'Career Counselling', desc: 'Expert guidance for schools and colleges.', icon: '👨‍🎓', color: 'from-primary-100 to-primary-200' },
  { title: 'Exam Alerts', desc: 'Never miss important exam notifications.', icon: '🚨', color: 'from-amber-400 to-orange-500' },
  { title: 'Admissions Guidance', desc: 'India and international university admissions.', icon: '🌍', color: 'from-secondary-600 to-secondary-800' },
  { title: 'Students & Parents', desc: 'Holistic support for families.', icon: '👨‍👩‍👧', color: 'from-primary-500 to-secondary-700' },
  { title: 'Study Abroad', desc: 'Get into top global universities.', icon: '✈️', color: 'from-amber-500 to-primary-600' },
  { title: 'Compliance', desc: 'Navigate regulatory and admission rules.', icon: '📋', color: 'from-secondary-700 to-secondary-900' },
]

export default function Home() {
  const [exams, setExams] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    api.get('/exams').then(r => setExams(r.data.slice(0, 4))).catch(() => { })
    api.get('/testimonials').then(r => setTestimonials(r.data.slice(0, 3))).catch(() => { })
    api.get('/blogs').then(r => setBlogs(r.data.slice(0, 3))).catch(() => { })
  }, [])

  return (
    <div className="overflow-x-hidden">
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center bg-hero-gradient overflow-hidden dotted-bg">
        {/* Decorative circles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-primary-600/15 rounded-full blur-[100px] animate-pulse-slow"></div>
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-700/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={container} initial="hidden" animate="show">
              <motion.div variants={fadeUp}
                className="inline-flex items-center gap-2 bg-primary-100 border border-primary-200 text-primary-700 px-4 py-2 rounded-full text-xl font-medium mb-6">
                <span className="text-secondary-900">MSME Regn. No:-</span> <span className="underline">UDYAM-DL-02-0095480</span>
              </motion.div>
              <motion.h1 variants={fadeUp} className="font-display text-5xl lg:text-6xl xl:text-7xl font-bold text-secondary-900 leading-tight mb-6">
                Brew Your <span className="text-gradient">Perfect</span> Career Path
              </motion.h1>
              <motion.p variants={fadeUp} className="text-secondary-600 text-xl leading-relaxed mb-8 max-w-lg">
                Advanced career counselling, real-time exam alerts, and personalized admissions guidance to help students and parents across India make the right choices.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
                <Link to="/appointment" className="btn-primary flex items-center gap-2 text-base px-8 py-4">
                  Book Consultation <ArrowRight size={18} />
                </Link>
                <Link to="/services" className="btn-outline border-secondary-900 text-secondary-900 hover:bg-secondary-900 hover:text-white text-base px-8 py-4">
                  Explore Services
                </Link>
              </motion.div>
              {/* Social proof */}
              <motion.div variants={fadeUp} className="flex items-center gap-4 mt-10">

                <div className="flex -space-x-2">
                  {['👩‍🎓', '👨‍🎓', '👩‍💼', '👨‍💼'].map((e, i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-primary-gradient border-2 border-white flex items-center justify-center text-sm">{e}</div>
                  ))}
                </div>
                <div>
                  <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />)}</div>
                  <p className="text-secondary-600 text-sm">Trusted by 10000+ students</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Hero card */}
            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.7 }}
              className="relative hidden lg:block ">
              <motion.div variants={fadeUp}
                className="inline-flex items-center gap-2 bg-primary-100 border border-primary-200 text-primary-700 px-2 py-2 rounded-full text-sm font-medium mb-6">
                <Bell size={14} /> All India Exam Alerts &amp; Career Guidance
              </motion.div>
              <div className="relative w-full max-w-md mx-auto bg-gradient-to-br from-primary-200 to-secondary-200 rounded-3xl p-8">
                <div className="glass rounded-3xl p-8 animate-float bg-primary-700/30 border border-primary-700/50">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-primary-gradient rounded-2xl flex items-center justify-center text-2xl">☕</div>
                    <div>
                      <p className="text-white font-semibold">Career Counselling Session</p>
                      <p className="text-primary-100 text-sm">Book your consultation today!</p>
                    </div>
                  </div>
                  <div className="space-y-3 mb-6">
                    {['Engineering Stream Analysis', 'Aptitude Assessment Complete', 'Top 5 Colleges Shortlisted'].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 bg-primary-700/30 rounded-xl p-3">
                        <div className="w-6 h-6 bg-primary-400 rounded-full flex items-center justify-center">✓</div>
                        <span className="text-white/90 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-primary-400/20 rounded-xl p-3 border border-primary-400/30">
                    {/* <p className="text-primary-300 text-sm font-medium"> </p> */}
                  </div>
                </div>
                {/* Floating badges */}
                <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-6 -right-6 glass rounded-2xl px-4 py-3">
                  <p className="text-white text-sm font-semibold">10000+ Students</p>
                  <p className="text-primary-200 text-xs">Successfully Guided</p>
                </motion.div>
                <motion.div animate={{ y: [5, -5, 5] }} transition={{ duration: 3.5, repeat: Infinity }}
                  className="absolute -bottom-6 -left-6 glass rounded-2xl px-4 py-3">
                  <p className="text-white text-sm font-semibold">98% Effectiveness Rate</p>
                  <p className="text-primary-200 text-xs">All India Admissions</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>



      {/* ── Stats ── */}
      <section className="py-16 bg-gradient-to-r from-sky-100 to-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(({ value, label, icon: Icon }) => (
              <motion.div key={label} variants={fadeUp} className="text-center">
                <Icon size={32} className="text-primary-600 mx-auto mb-3" />
                <div className="font-display text-4xl font-bold text-secondary-900 mb-1">{value}</div>
                <div className="text-secondary-600 text-sm font-medium">{label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── About Founder ── */}
      <AboutFounder />

      {/* ── Services ── */}
      <section className="py-10 pattern-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <p className="text-primary-500 font-semibold uppercase tracking-widest text-sm mb-3">What We Offer</p>
            <h2 className="section-title">Services Designed for Your Future</h2>
            <p className="section-subtitle">Comprehensive career counselling and admissions guidance across all stages of education.</p>
          </motion.div>
          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(s => (
              <motion.div key={s.title} variants={fadeUp}
                className="card p-6 group cursor-pointer" onClick={() => { }}>
                <div className={`w-14 h-14 bg-gradient-to-br ${s.color} rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {s.icon}
                </div>
                <h3 className="font-display text-xl font-bold text-secondary-900 mb-2">{s.title}</h3>
                <p className="text-secondary-500 text-sm leading-relaxed">{s.desc}</p>
                <Link to="/services" className="flex items-center gap-1 text-primary-500 font-semibold text-sm mt-4 group-hover:gap-2 transition-all">
                  Learn more <ChevronRight size={16} />
                </Link>
              </motion.div>
            ))}
          </motion.div>
          <div className="text-center mt-10">
            <Link to="/services" className="btn-primary inline-flex items-center gap-2">View All Services <ArrowRight size={18} /></Link>
          </div>
        </div>
      </section>

      {/* ── Exam Alerts Preview ── */}
      {exams.length > 0 && (
        <section className="py-20 bg-gray-50 border-y border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between mb-10">
              <div>
                <p className="text-primary-400 font-semibold uppercase tracking-widest text-sm mb-2">Stay Updated</p>
                <h2 className="font-display text-3xl font-bold text-secondary-900">All India Exam Alerts 🔔</h2>
              </div>
              <Link to="/exam-alerts" className="mt-4 md:mt-0 btn-outline border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white">
                View All Exams
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {exams.map((exam, i) => (
                <motion.div key={exam.id} initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass rounded-2xl p-5 flex items-start gap-4 hover:bg-white/15 transition-colors group">
                  <div className="w-12 h-12 bg-primary-gradient rounded-xl flex items-center justify-center shrink-0">
                    <Bell size={20} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-secondary-900 font-semibold truncate">{exam.name}</h3>
                      <span className="badge bg-primary-100 text-primary-700 shrink-0">{exam.category}</span>
                    </div>
                    <p className="text-secondary-600 text-sm mt-1">{exam.description?.slice(0, 80)}...</p>
                    {exam.exam_date && (
                      <p className="text-blue-100 text-xs mt-2 font-medium">📅 Exam: {new Date(exam.exam_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}


      {/* <GoogleReviews /> */}

      <GoogleReviews />



      {/* ── Testimonials ── */}
      {testimonials.length > 0 && (
        <section className="py-5 pattern-bg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
              <p className="text-primary-500 font-semibold uppercase tracking-widest text-sm mb-3">Success Stories</p>
              <h2 className="section-title">What Our Students Say</h2>
            </motion.div>
            <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map(t => (
                <motion.div key={t.id} variants={fadeUp} className="card p-6">
                  <div className="flex gap-1 mb-4">{[...Array(t.rating || 5)].map((_, i) => <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />)}</div>
                  <p className="text-secondary-700 italic leading-relaxed mb-5">"{t.message}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-gradient rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-secondary-900 text-sm">{t.name}</p>
                      <p className="text-secondary-500 text-xs">{t.designation}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            <div className="text-center mt-10">
              <Link to="/testimonials" className="btn-outline inline-flex items-center gap-2">Read All Stories <ArrowRight size={18} /></Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Blogs Preview ── */}
      {blogs.length > 0 && (
        <section className="py-10 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <p className="text-primary-500 font-semibold uppercase tracking-widest text-sm mb-2">Knowledge Hub</p>
                <h2 className="font-display text-3xl font-bold text-secondary-900">Latest from Our Blog</h2>
              </div>
              <Link to="/blogs" className="btn-outline hidden md:inline-flex items-center gap-2">All Posts <ArrowRight size={18} /></Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogs.map((blog, i) => (
                <motion.div key={blog.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="card overflow-hidden group">
                  <div className="h-36 bg-primary-gradient flex items-center justify-center">
                    <span className="text-5xl">📖</span>
                  </div>
                  <div className="p-5">
                    <span className="badge bg-primary-100 text-primary-700 mb-3">{blog.category}</span>
                    <h3 className="font-display font-bold text-secondary-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">{blog.title}</h3>
                    <p className="text-secondary-500 text-sm line-clamp-2 mb-4">{blog.summary}</p>
                    <Link to={`/blogs/${blog.slug}`} className="text-primary-500 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                      Read More <ChevronRight size={16} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Social Gallery ── */}
      <SocialGallery />




      {/* ── CTA ── */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">Ready to Brew Your Success?</h2>
            <p className="text-white/80 text-xl mb-10">Book a consultation with our expert career counsellors today.</p>
            <Link to="/appointment" className="bg-white text-primary-700 font-bold px-10 py-4 rounded-full text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-2">
              Book Appointment <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
