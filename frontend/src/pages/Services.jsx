import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const fade = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }
const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }

const services = [
  {
    id: 'career', icon: '🎯', title: 'Career Counselling',
    tagline: 'Find Your True Calling',
    desc: 'Our flagship service uses psychometric tests, aptitude assessments, and one-on-one sessions to help you discover the career that suits your personality, skills, and ambitions.',
    features: ['Psychometric & IQ Assessment', 'Interest & Aptitude Mapping', 'Career Path Roadmap', 'One-on-One Expert Sessions', 'Follow-up Support'],
    color: 'from-primary-400 to-primary-600',
  },
  {
    id: 'schools', icon: '🏫', title: 'Schools & Colleges / Universities',
    tagline: 'Education at Every Level',
    desc: 'We partner with schools and colleges to provide structured career counselling programs, stream selection guidance, and institution-level workshops.',
    features: ['School Stream Selection (PCM/PCB/Commerce/Arts)', 'College Shortlisting', 'Entrance Exam Planning', 'Campus Workshops & Seminars', 'Teacher & Principal Collaborations'],
    color: 'from-amber-400 to-orange-500',
  },
  {
    id: 'students', icon: '👨‍👩‍👧', title: 'Students & Parents',
    tagline: 'A Journey We Take Together',
    desc: 'Career decisions affect the whole family. Our counselling sessions include parents as active participants, bridging the gap between expectations and aspirations.',
    features: ['Joint Parent-Student Counselling', 'Managing Parental Expectations', 'Communication Strategy', 'Stress & Anxiety Management', 'Long-term Planning Support'],
    color: 'from-secondary-600 to-secondary-800',
  },
  {
    id: 'india', icon: '🇮🇳', title: 'Admissions Guidance — India',
    tagline: 'Navigate Indian Education System',
    desc: 'End-to-end guidance for admission to top Indian colleges including IITs, NITs, IIMs, AIIMS, NLUs, and more.',
    features: ['IIT/NIT/IIIT Guidance', 'Medical (AIIMS/JIPMER)', 'Law (CLAT/AILET)', 'Management (CAT/XAT)', 'Application & SOP Support'],
    color: 'from-green-500 to-emerald-700',
  },
  {
    id: 'abroad', icon: '✈️', title: 'Admissions Guidance — Abroad',
    tagline: 'Your Global Education Partner',
    desc: 'From shortlisting universities in the USA, UK, Canada, Australia, and Germany to scholarship applications, we guide every step of your study abroad journey.',
    features: ['University Shortlisting (USA, UK, Canada, AUS)', 'SAT/GRE/GMAT/IELTS Guidance', 'SOP & LOR Writing Support', 'Scholarship Applications', 'Visa & Pre-Departure Counselling'],
    color: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'compliance', icon: '📋', title: 'Compliance',
    tagline: 'Navigate Rules with Confidence',
    desc: 'Our compliance team helps students and institutions understand and fulfill all regulatory requirements for education, including recognition of degrees and equivalency certificates.',
    features: ['Degree Recognition Assistance', 'Equivalency Certificate Guidance', 'UGC/AICTE Compliance', 'Foreign Degree Verification', 'Documentation Support'],
    color: 'from-purple-500 to-purple-800',
  },
]

export default function Services() {
  return (
    <div className="">
      {/* Hero */}
      <section className="py-24 bg-secondary-gradient text-center relative overflow-hidden">
        <div className="absolute inset-0"><div className="absolute top-10 right-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl"></div></div>
        <div className="relative max-w-4xl mx-auto px-4">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-primary-400 font-semibold uppercase tracking-widest text-sm mb-4">What We Offer</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-5xl font-bold text-white mb-5">
            Our <span className="text-gradient">Services</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-white/70 text-xl">
            Comprehensive career guidance services for every stage of your educational journey.
          </motion.p>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 pattern-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="space-y-16">
            {services.map((svc, i) => (
              <motion.div key={svc.id} id={svc.id} variants={fade}
                className={`grid lg:grid-cols-2 gap-12 items-center ${i % 2 !== 0 ? 'lg:grid-flow-col-reverse' : ''}`}>
                <div className={i % 2 !== 0 ? 'lg:order-2' : ''}>
                  <div className={`w-16 h-16 bg-gradient-to-br ${svc.color} rounded-2xl flex items-center justify-center text-3xl mb-5`}>{svc.icon}</div>
                  <p className="text-primary-500 font-semibold uppercase tracking-wider text-sm mb-2">{svc.tagline}</p>
                  <h2 className="font-display text-3xl font-bold text-secondary-900 mb-4">{svc.title}</h2>
                  <p className="text-secondary-600 leading-relaxed mb-6">{svc.desc}</p>
                  <ul className="space-y-2.5 mb-6">
                    {svc.features.map(f => (
                      <li key={f} className="flex items-center gap-3 text-secondary-700">
                        <div className="w-5 h-5 bg-primary-gradient rounded-full flex items-center justify-center shrink-0">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/appointment" className="btn-primary inline-flex items-center gap-2">Book Consultation <ArrowRight size={16} /></Link>
                </div>
                <div className={`${i % 2 !== 0 ? 'lg:order-1' : ''} card p-8 bg-gradient-to-br ${svc.color} text-white`}>
                  <div className="text-6xl mb-6">{svc.icon}</div>
                  <h3 className="font-display text-2xl font-bold mb-3">{svc.title}</h3>
                  <p className="text-white/80 mb-6">{svc.tagline}</p>
                  <div className="grid grid-cols-2 gap-3">
                    {svc.features.slice(0, 4).map(f => (
                      <div key={f} className="bg-white/20 rounded-xl p-3 text-sm text-white/90">{f}</div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary-gradient text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-display text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-white/80 mb-8 text-lg">Book a free 30-minute consultation with our experts today.</p>
          <Link to="/appointment" className="bg-white text-primary-700 font-bold px-10 py-4 rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-2">
            Schedule Now <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  )
}
