import { motion } from 'framer-motion'
import { Award, Target, Users, Heart } from 'lucide-react'

const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }
const container = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } }

const team = [
  { name: 'Dr. Priya Sharma', role: 'Founder & Chief Career Counsellor', bio: 'PhD in Educational Psychology with 15+ years guiding students to their dream careers.', emoji: '👩‍🏫', expertise: ['Career Assessment', 'Study Abroad', 'Medical Streams'] },
  { name: 'Rajesh Kumar', role: 'Senior Career Advisor', bio: 'Former IIT professor with deep expertise in engineering and technology career paths.', emoji: '👨‍💼', expertise: ['Engineering', 'IIT/NIT Guidance', 'GATE Prep'] },
  { name: 'Anita Mehta', role: 'Admissions Specialist', bio: 'Ex-admission officer with insider knowledge of top Indian and international universities.', emoji: '👩‍💻', expertise: ['UK/USA Admissions', 'Scholarships', 'SOP Writing'] },
  { name: 'Vikram Nair', role: 'Law & Humanities Counsellor', bio: 'Advocate with 10 years experience guiding students toward law and humanities careers.', emoji: '⚖️', expertise: ['CLAT Prep', 'Law Careers', 'Humanities Streams'] },
  { name: 'Deepika Singh', role: 'School Outreach Coordinator', bio: 'Passionate educator bridging the gap between schools and future-ready career choices.', emoji: '🏫', expertise: ['School Counselling', 'Parent Guidance', 'Stream Selection'] },
  { name: 'Arjun Patel', role: 'Commerce & MBA Advisor', bio: 'CA and MBA from IIM with expertise in finance, commerce, and management career paths.', emoji: '📊', expertise: ['CAT/MBA', 'CA/CFA', 'Commerce Streams'] },
]

const values = [
  { icon: Target, title: 'Purpose-Driven', desc: 'We help every student discover their unique purpose and align their career accordingly.' },
  { icon: Users, title: 'Student-First', desc: 'Every decision we make centers on the best interest of our students and families.' },
  { icon: Award, title: 'Expert Guidance', desc: 'Our team of certified counsellors brings decades of industry and academic expertise.' },
  { icon: Heart, title: 'Compassionate Care', desc: 'Career decisions are emotional. We provide empathy and understanding throughout.' },
]

export default function About() {
  return (
    <div className="" >
      {/* Hero */}
      <section className="relative py-24 bg-secondary-gradient overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-primary-400 font-semibold uppercase tracking-widest text-sm mb-4">Who We Are</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="font-display text-5xl lg:text-6xl font-bold text-white mb-6">
            About <span className="text-gradient">Career Coffee</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-white/70 text-xl leading-relaxed">
            Founded with a passion for empowering India's youth, we are a premier career counselling firm dedicated to helping students, parents, and professionals make informed, confident career decisions.
          </motion.p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 pattern-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-top">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p className="text-primary-500 font-semibold uppercase tracking-widest text-sm mb-3">Our Story</p>
              <h2 className="font-sens text-2xl font-bold text-secondary-900 mb-6">Career Coffee-the unfiltered career discussion is a trusted destination for students parents and professionals seeking clarity, confidence, and direction in their educational and professional journeys.</h2>
              <div className="space-y-4 text-secondary-600 leading-relaxed">
                <p>Career Coffee-the unfiltered career discussion is a trusted destination for meaningful, unfiltered career counselling and Institutional guidance. We specialize in providing personalized career solutions for students and professionals, helping them make informed academic and professional decisions.Our services include stream selection, entrance exam planning, college admissions support, profile building, personality development, and interview preparation—ensuring a holistic approach to career growth.</p>
                <p>At Career Coffee, we believe that effective career counselling goes beyond standard advice. It requires honest conversations, deep understanding of individual aspirations, and alignment with personality traits. Our counselling approach is designed to create a comfortable environment where individuals can openly express their goals, enabling us to guide them with clarity and precision.</p>
                <p>With a cumulative experience of over four decades, our team also extends its expertise to institutional support and compliance. We assist educational institutions in navigating academic frameworks, accreditation processes, and regulatory requirements while maintaining quality and value-driven education systems. Our focus is on strengthening institutional capabilities alongside student success.
                  We strongly believe that education is not a commodity but a transformative experience. In an evolving academic landscape, we remain committed to integrity, strategic planning, and long-term impact.
                  At Career Coffee, we don’t just guide careers—we empower individuals and institutions to grow with purpose, clarity, and confidence.</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex flex-col gap-4">
              {[
                { label: 'Students Counselled', value: '10000+', icon: '🎓' },
                { label: 'Years of Experience', value: '13+', icon: '⭐' },
                { label: 'Partner Institutions', value: '50+', icon: '🏛️' },
                { label: 'Success Rate', value: '98%', icon: '🏆' },
              ].map(item => (
                <div key={item.label} className="card p-6 text-center">
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <div className="font-display text-3xl font-bold text-primary-600 mb-1">{item.value}</div>
                  <div className="text-secondary-500 text-sm">{item.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-secondary-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { title: '🎯 Our Mission', text: 'To democratize quality career counselling by making expert guidance accessible to every student across India, enabling them to discover their purpose and achieve their fullest potential.' },
              { title: '🌟 Our Vision', text: 'A future where every Indian student makes career decisions with confidence, clarity, and courage — guided by data-driven insights and compassionate expert mentorship.' },
            ].map(item => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="glass rounded-2xl p-8">
                <h3 className="font-display text-2xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-white/70 leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-title">Our Core Values</h2>
          </div>
          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(v => (
              <motion.div key={v.title} variants={fadeUp} className="card p-6 text-center group">
                <div className="w-14 h-14 bg-primary-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <v.icon size={26} className="text-white" />
                </div>
                <h3 className="font-display font-bold text-secondary-900 text-lg mb-2">{v.title}</h3>
                <p className="text-secondary-500 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 pattern-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-primary-500 font-semibold uppercase tracking-widest text-sm mb-3">Meet the Experts</p>
            <h2 className="section-title">Our Dedicated Team</h2>
            <p className="section-subtitle">Certified counsellors passionate about shaping futures.</p>
          </div>
          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map(member => (
              <motion.div key={member.name} variants={fadeUp} className="card p-6 group">
                <div className="w-20 h-20 bg-primary-gradient rounded-2xl flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {member.emoji}
                </div>
                <h3 className="font-display text-xl font-bold text-secondary-900 mb-1">{member.name}</h3>
                <p className="text-primary-600 font-semibold text-sm mb-3">{member.role}</p>
                <p className="text-secondary-500 text-sm leading-relaxed mb-4">{member.bio}</p>
                <div className="flex flex-wrap gap-2">
                  {member.expertise.map(e => (
                    <span key={e} className="badge bg-primary-100 text-primary-700 text-xs">{e}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
}
