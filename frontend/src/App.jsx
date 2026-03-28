import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import ExamAlerts from './pages/ExamAlerts'
import Testimonials from './pages/Testimonials'
import Blogs from './pages/Blogs'
import BlogDetail from './pages/BlogDetail'
import Appointment from './pages/Appointment'
import Contact from './pages/Contact'
import Login from './pages/Login'
import UserDashboard from './pages/UserDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageUsers from './pages/admin/ManageUsers'
import ManageBlogs from './pages/admin/ManageBlogs'
import ManageAppointments from './pages/admin/ManageAppointments'
import ManageTestimonials from './pages/admin/ManageTestimonials'
import ManageExams from './pages/admin/ManageExams'

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary-400 border-t-transparent rounded-full animate-spin"></div></div>
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />
  return children
}

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}

function AdminLayout({ children }) {
  return <div className="min-h-screen bg-background">{children}</div>
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/about" element={<Layout><About /></Layout>} />
          <Route path="/services" element={<Layout><Services /></Layout>} />
          <Route path="/exam-alerts" element={<ProtectedRoute><Layout><ExamAlerts /></Layout></ProtectedRoute>} />
          <Route path="/scholarships" element={<ProtectedRoute><Layout><ExamAlerts initialTab="Scholarship" /></Layout></ProtectedRoute>} />
          <Route path="/internships" element={<ProtectedRoute><Layout><ExamAlerts initialTab="Government Internship" /></Layout></ProtectedRoute>} />
          <Route path="/testimonials" element={<Layout><Testimonials /></Layout>} />
          <Route path="/blogs" element={<Layout><Blogs /></Layout>} />
          <Route path="/blogs/:slug" element={<Layout><BlogDetail /></Layout>} />
          <Route path="/appointment" element={<Layout><Appointment /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          <Route path="/login" element={<Login />} />

          {/* User routes */}
          <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />

          {/* Admin routes */}
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute adminOnly><AdminLayout><ManageUsers /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/blogs" element={<ProtectedRoute adminOnly><AdminLayout><ManageBlogs /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/appointments" element={<ProtectedRoute adminOnly><AdminLayout><ManageAppointments /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/testimonials" element={<ProtectedRoute adminOnly><AdminLayout><ManageTestimonials /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/exams" element={<ProtectedRoute adminOnly><AdminLayout><ManageExams alertType="Exam Alert" pageTitle="Manage Exam Alerts" pageDesc="Add or update competitive exam details for students." /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/scholarships" element={<ProtectedRoute adminOnly><AdminLayout><ManageExams alertType="Scholarship" pageTitle="Manage Scholarships" pageDesc="Add or update scholarship alerts and details." /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/internships" element={<ProtectedRoute adminOnly><AdminLayout><ManageExams alertType="Government Internship" pageTitle="Manage Internships" pageDesc="Add or update government internship alerts." /></AdminLayout></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
