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

  // Forgot Password state
  const [forgotStep, setForgotStep] = useState('none') // 'none', 'request', 'reset'
  const [resetForm, setResetForm] = useState({ user_id: '', otp: '', newPassword: '' })

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
      const res = await api.post('/auth/verify-otp', { user_id: pendingUserId, otp })
      login(res.data.token, res.data.user)
      toast.success(`Welcome back, ${res.data.user.name}! 🔐`, { icon: <ShieldCheck size={18} className="text-green-400" /> })

      // Use window.location.href to force a full reload and ensure state is correctly picked up by ProtectedRoute
      setTimeout(() => {
        window.location.href = getRedirectPath(res.data.user.role);
      }, 500);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotRequest = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/auth/forgot-password', { user_id: resetForm.user_id })
      setPendingUserId(res.data.user_id || resetForm.user_id)
      setForgotStep('reset')
      toast.success('Reset code sent to your email!')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send reset code')
    } finally { setLoading(false) }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (resetForm.otp.length !== 6) return toast.error('Enter 6-digit code')
    if (resetForm.newPassword.length < 6) return toast.error('Password must be at least 6 characters')

    setLoading(true)
    try {
      await api.post('/auth/reset-password', {
        user_id: pendingUserId,
        otp: resetForm.otp,
        newPassword: resetForm.newPassword
      })
      toast.success('Password reset successful! Please login.')
      setForgotStep('none')
      setOtpStep(false)
      setForm({ user_id: pendingUserId, password: '' })
    } catch (err) {
      toast.error(err.response?.data?.error || 'Reset failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 flex items-center justify-center px-4 py-10 relative overflow-hidden dotted-bg">
      {/* Decorative */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-400/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Back to Home Button - Top Left */}
      <Link to="/" className="absolute top-6 left-6 btn-primary hover:bg-white text-white hover:text-secondary-900 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 z-10">
        ← Back to Home
      </Link>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-2">
            <div className="bg-primary-gradient rounded-full flex items-center justify-center shadow-2xl glow-primary">
              <img src="/gallery/logo.png" alt="CareerCoffee Logo" className='w-20 h-20 rounded-full' />
            </div>
            <div>
              <div className="font-display text-2xl font-bold text-secondary-900">CareerCoffee</div>
              <div className="text-primary-600 text-xs tracking-widest uppercase font-medium">Admin & User Portal</div>
            </div>
          </Link>
        </div>

        <div className="bg-blue-50 glass backdrop-blur-md border border-gray-200 rounded-3xl p-8 shadow-lg">
          <AnimatePresence mode="wait">
            {forgotStep === 'request' ? (
              /* ── STEP 3: Forgot Request ── */
              <motion.div key="forgot-req" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                <h2 className="font-display text-2xl font-bold text-secondary-900 text-center mb-2">Reset Password</h2>
                <p className="text-secondary-600 text-center text-sm mb-8">Enter your User ID or Email to receive a reset code</p>
                <form onSubmit={handleForgotRequest} className="space-y-5">
                  <div>
                    <label className="block text-secondary-700 text-sm font-medium mb-1.5">User ID or Email</label>
                    <input required value={resetForm.user_id} onChange={e => setResetForm(p => ({ ...p, user_id: e.target.value }))}
                      placeholder="Enter User ID or Email" className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-primary-400 focus:outline-none transition-all" />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 flex items-center justify-center gap-2">
                    {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "Send Reset Code"}
                  </button>
                  <button type="button" onClick={() => setForgotStep('none')} className="w-full text-center text-secondary-500 hover:text-secondary-700 text-sm py-2">
                    ← Back to Login
                  </button>
                </form>
              </motion.div>
            ) : forgotStep === 'reset' ? (
              /* ── STEP 4: Forgot Reset ── */
              <motion.div key="forgot-reset" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                <div className="text-center mb-6">
                  <h2 className="font-display text-2xl font-bold text-secondary-900 mb-10">Create New Password</h2>
                  <p className="text-secondary-600 text-sm mb-10">Enter the code sent to your email and your new password</p>
                </div>
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <label className="block text-secondary-700 text-sm font-medium mb-1.5">6-Digit Code</label>
                    <input required value={resetForm.otp} onChange={e => setResetForm(p => ({ ...p, otp: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
                      placeholder="• • • • • •" className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-center text-xl font-mono tracking-widest focus:ring-2 focus:ring-primary-400 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-secondary-700 text-sm font-medium mb-1.5">New Password</label>
                    <input required type="password" value={resetForm.newPassword} onChange={e => setResetForm(p => ({ ...p, newPassword: e.target.value }))}
                      placeholder="Minimum 6 characters" className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-primary-400 focus:outline-none" />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 flex items-center justify-center gap-2">
                    {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "Reset Password"}
                  </button>
                  <button type="button" onClick={() => setForgotStep('request')} className="w-full text-center text-secondary-500 hover:text-secondary-700 text-sm py-2">
                    ← Back to Previous Step
                  </button>
                </form>
              </motion.div>
            ) : otpStep ? (
              /* ── STEP 2: OTP ── */
              <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <div className="flex flex-col items-center mb-6">
                  <div className="w-16 h-16 bg-primary-500/20 border border-primary-500/40 rounded-2xl flex items-center justify-center mb-4">
                    <KeyRound size={32} className="text-primary-400" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-secondary-900 text-center mb-1">Admin Verification</h2>
                  <p className="text-secondary-600 text-center text-sm">{otpHint}</p>
                </div>

                <form onSubmit={handleVerifyOTP} className="space-y-5">
                  <div>
                    <label className="block text-secondary-700 text-sm font-medium mb-1.5">Enter 6-digit OTP</label>
                    <input
                      required value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="• • • • • •" maxLength={6} autoComplete="one-time-code"
                      className="w-full px-4 py-4 rounded-xl bg-white border border-gray-200 text-secondary-900 text-center text-2xl font-mono tracking-[0.6em] placeholder-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all" />
                    <p className="text-secondary-500 text-xs text-center mt-2">OTP is valid for 10 minutes</p>
                  </div>

                  <button type="submit" disabled={loading || otp.length !== 6}
                    className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                    {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><ShieldCheck size={18} /> Verify OTP</>}
                  </button>

                  <button type="button" onClick={() => { setOtpStep(false); setOtp(''); setPendingUserId('') }}
                    className="w-full text-center text-secondary-500 hover:text-secondary-700 text-sm transition-colors py-2">
                    ← Back to Login
                  </button>
                </form>
              </motion.div>
            ) : (
              /* ── STEP 1: Credentials ── */
              <motion.div key="credentials" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="font-display text-2xl font-bold text-secondary-900 text-center mb-2">Welcome Back</h2>
                <p className="text-secondary-600 text-center text-sm mb-8">Sign in to access your dashboard</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-secondary-700 text-sm font-medium mb-1.5">User ID or Email</label>
                    <input required value={form.user_id} onChange={e => setForm(p => ({ ...p, user_id: e.target.value }))}
                      placeholder="Enter User ID or Email" autoComplete="username"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all" />
                  </div>
                  <div>
                    <label className="block text-secondary-700 text-sm font-medium mb-1.5">Password</label>
                    <div className="relative">
                      <input required value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                        type={showPass ? 'text' : 'password'} placeholder="Enter your password" autoComplete="current-password"
                        className="w-full px-4 py-3 pr-12 rounded-xl bg-white border border-gray-200 text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all" />
                      <button type="button" onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-500 hover:text-secondary-700 transition-colors">
                        {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <div className="flex justify-end mt-1.5">
                      <button type="button" onClick={() => setForgotStep('request')}
                        className="text-primary-600 hover:text-primary-700 text-xs font-medium">
                        Forgot Password?
                      </button>
                    </div>
                  </div>

                  <button type="submit" disabled={loading}
                    className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                    {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><LogIn size={18} /> Sign In</>}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="mt-8 text-center text-secondary-600 text-lg">
          <Link to="/contact" className="text-primary-600 hover:text-primary-700"> Contact administrator for account access.</Link>
        </p>
      </motion.div>
    </div>
  )
}
