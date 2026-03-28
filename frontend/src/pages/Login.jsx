import { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Coffee, Eye, EyeOff, LogIn, ShieldCheck, KeyRound } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'

export default function Login() {
  const [form, setForm] = useState({ user_id: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  // OTP step state
  const [otpStep, setOtpStep] = useState(false)
  const [pendingUserId, setPendingUserId] = useState('')
  const [otpHint, setOtpHint] = useState('')
  const [otp, setOtp] = useState('')

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const getRedirectPath = (role) => location.state?.from?.pathname || (role === 'admin' ? '/admin' : '/')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/auth/login', form)
      if (res.data.requires_otp) {
        // Admin 2-step: go to OTP screen
        setPendingUserId(res.data.user_id)
        setOtpHint(res.data.message)
        setOtpStep(true)
        toast('OTP sent to your registered email!', { icon: '📧' })
      } else {
        // Regular user
        login(res.data.token, res.data.user)
        toast.success(`Welcome back, ${res.data.user.name}!`)
        navigate(getRedirectPath(res.data.user.role), { replace: true })
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid credentials. Please try again.')
    } finally { setLoading(false) }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    if (otp.length !== 6) { toast.error('Please enter a 6-digit OTP'); return }
    setLoading(true)
    try {
      console.log('Sending OTP verification...', { user_id: pendingUserId, otp });
      const res = await api.post('/auth/verify-otp', { user_id: pendingUserId, otp })
      console.log('Verification Success:', res.data);

      login(res.data.token, res.data.user)
      toast.success(`Welcome back, ${res.data.user.name}! 🔐`, { icon: <ShieldCheck size={18} className="text-green-400" /> })

      // Use window.location.href to force a full reload and ensure state is correctly picked up by ProtectedRoute
      setTimeout(() => {
        window.location.href = getRedirectPath(res.data.user.role);
      }, 500);
    } catch (err) {
      console.error('Verification Error:', err.response?.data || err.message);
      toast.error(err.response?.data?.error || 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-secondary-gradient flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-400/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-2">
            <div className="w-16 h-16 bg-primary-gradient rounded-2xl flex items-center justify-center shadow-2xl glow-primary">
              <Coffee size={32} className="text-white" />
            </div>
            <div>
              <div className="font-display text-2xl font-bold text-white">CareerCoffee</div>
              <div className="text-primary-400 text-xs tracking-widest uppercase font-medium">Admin & User Portal</div>
            </div>
          </Link>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl">
          <AnimatePresence mode="wait">
            {!otpStep ? (
              /* ── STEP 1: Credentials ── */
              <motion.div key="credentials" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="font-display text-2xl font-bold text-white text-center mb-2">Welcome Back</h2>
                <p className="text-white/60 text-center text-sm mb-8">Sign in to access your dashboard</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-1.5">User ID or Email</label>
                    <input required value={form.user_id} onChange={e => setForm(p => ({ ...p, user_id: e.target.value }))}
                      placeholder="Enter User ID or Email" autoComplete="username"
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all" />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-1.5">Password</label>
                    <div className="relative">
                      <input required value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                        type={showPass ? 'text' : 'password'} placeholder="Enter your password" autoComplete="current-password"
                        className="w-full px-4 py-3 pr-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all" />
                      <button type="button" onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors">
                        {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <button type="submit" disabled={loading}
                    className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                    {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><LogIn size={18} /> Sign In</>}
                  </button>

                  <div className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-3 text-[11px] text-center">
                    <p className="text-primary-300 font-bold mb-1 uppercase tracking-wider">Super Admin Login</p>
                    <p className="text-white/60">User ID: <span className="text-white font-mono bg-white/5 px-1.5 rounded">admin</span></p>
                    <p className="text-white/60">Password: <span className="text-white font-mono bg-white/5 px-1.5 rounded">36609ppal</span></p>
                  </div>
                </form>
              </motion.div>
            ) : (
              /* ── STEP 2: OTP ── */
              <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <div className="flex flex-col items-center mb-6">
                  <div className="w-16 h-16 bg-primary-500/20 border border-primary-500/40 rounded-2xl flex items-center justify-center mb-4">
                    <KeyRound size={32} className="text-primary-400" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-white text-center mb-1">Admin Verification</h2>
                  <p className="text-white/60 text-center text-sm">{otpHint}</p>
                </div>

                <form onSubmit={handleVerifyOTP} className="space-y-5">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-1.5">Enter 6-digit OTP</label>
                    <input
                      required value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="• • • • • •" maxLength={6} autoComplete="one-time-code"
                      className="w-full px-4 py-4 rounded-xl bg-white/10 border border-white/20 text-white text-center text-2xl font-mono tracking-[0.6em] placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all" />
                    <p className="text-white/40 text-xs text-center mt-2">OTP is valid for 10 minutes</p>
                  </div>

                  <button type="submit" disabled={loading || otp.length !== 6}
                    className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                    {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><ShieldCheck size={18} /> Verify OTP</>}
                  </button>

                  <button type="button" onClick={() => { setOtpStep(false); setOtp(''); setPendingUserId('') }}
                    className="w-full text-center text-white/50 hover:text-white text-sm transition-colors py-2">
                    ← Back to Login
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="mt-8 text-center text-white/70 text-sm">
          Contact administrator for account access.
        </p>
        <p className="text-center text-white/50 text-xs mt-4">
          <Link to="/" className="hover:text-white transition-colors">← Back to Home</Link>
        </p>
      </motion.div>
    </div>
  )
}
