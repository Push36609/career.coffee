import { useState, useEffect } from 'react'
import { Upload, FileSpreadsheet, Loader2, CheckCircle2, ShieldAlert, Trash2, Calendar, Clock, ExternalLink, School, Bell, CheckSquare } from 'lucide-react'
import * as XLSX from 'xlsx'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import AdminLayout from './AdminLayout'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'

export default function ManageApsExams() {
  const { isSuperAdmin } = useAuth()
  const [loading, setLoading] = useState(false)
  const [parsedData, setParsedData] = useState(null)
  
  const [existingExams, setExistingExams] = useState([])
  const [selectedIds, setSelectedIds] = useState([])
  const [fetching, setFetching] = useState(false)

  const fetchExams = () => {
    setFetching(true)
    api.get('/aps-exams')
      .then(res => setExistingExams(res.data))
      .catch(err => console.error(err))
      .finally(() => setFetching(false))
  }

  useEffect(() => {
    if (isSuperAdmin) fetchExams()
  }, [isSuperAdmin])

  const handleDelete = async (ids) => {
    if (!window.confirm(`Are you sure you want to delete ${ids.length} exam(s)? This action cannot be undone.`)) return
    try {
      await api.delete('/aps-exams', { data: { ids } })
      toast.success(`Successfully deleted ${ids.length} exam(s)`)
      setSelectedIds([])
      fetchExams() // Refresh list
    } catch (err) {
      toast.error('Failed to delete exams')
    }
  }

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === existingExams.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(existingExams.map(e => e.id))
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result
        const wb = XLSX.read(bstr, { type: 'binary' })
        const wsname = wb.SheetNames[0]
        const ws = wb.Sheets[wsname]

        // Parse rows to JSON (display values)
        const data = XLSX.utils.sheet_to_json(ws)

        // Also extract actual hyperlink URLs from the WEBSITE column
        if (ws['!ref']) {
          const range = XLSX.utils.decode_range(ws['!ref'])

          // Find the WEBSITE column index by scanning the header row
          let websiteColIndex = -1
          for (let c = range.s.c; c <= range.e.c; c++) {
            const headerCell = ws[XLSX.utils.encode_cell({ r: range.s.r, c })]
            if (headerCell && String(headerCell.v).trim().toUpperCase() === 'WEBSITE') {
              websiteColIndex = c
              break
            }
          }

          // For each data row, if the WEBSITE cell has a hyperlink, use its Target URL
          if (websiteColIndex !== -1) {
            for (let r = range.s.r + 1; r <= range.e.r; r++) {
              const cellAddr = XLSX.utils.encode_cell({ r, c: websiteColIndex })
              const cell = ws[cellAddr]
              const rowIndex = r - range.s.r - 1
              if (cell && data[rowIndex]) {
                // Prefer the actual hyperlink URL over display text
                if (cell.l && cell.l.Target) {
                  data[rowIndex]['WEBSITE'] = cell.l.Target
                } else if (cell.v) {
                  data[rowIndex]['WEBSITE'] = String(cell.v).trim()
                }
              }
            }
          }
        }

        setParsedData(data)
        toast.success(`Successfully parsed ${data.length} records!`)
      } catch (err) {
        console.error(err)
        toast.error('Failed to parse Excel file. Make sure it is a valid .xlsx or .csv')
      }
    }
    reader.readAsBinaryString(file)
  }

  const handleUploadToDatabase = async () => {
    if (!parsedData || parsedData.length === 0) return
    setLoading(true)
    try {
      const res = await api.post('/aps-exams/bulk', { exams: parsedData })
      toast.success(res.data.message || `Uploaded ${parsedData.length} records to database!`)
      setParsedData(null)
      fetchExams() // Refresh after upload
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to upload to database')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-secondary-900">Manage APS Exams (Excel Upload)</h2>
        <p className="text-secondary-500 text-sm mt-1">Upload the Excel file containing APS Dhaula Kuan exam alerts.</p>
      </div>

      {/* Upload panel — superadmin only */}
      {isSuperAdmin ? (
        <div className="card p-8 mb-8 border-2 border-dashed border-primary-200 bg-primary-50/50 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center mb-4">
            <FileSpreadsheet size={32} className="text-primary-500" />
          </div>
          <h3 className="font-bold text-lg text-secondary-900 mb-2">Upload Excel File</h3>
          <p className="text-sm text-secondary-500 mb-6 max-w-md">
            Columns required: <strong>EXAM, APPLICATION WINDOW, EXAM PERIOD, MAJOR COLLEGES/INSTITUTE, COURSES OFFERED, WEBSITE, STREAM</strong> (STREAM values: <em>PCM</em>, <em>PCB</em>, or leave blank for Both).
          </p>
          <label className="btn-primary flex items-center gap-2 cursor-pointer">
            <Upload size={18} /> Select File
            <input type="file" accept=".xlsx, .xls, .csv" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>
      ) : (
        <div className="card p-8 mb-8 border-2 border-dashed border-yellow-200 bg-yellow-50 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center mb-4">
            <ShieldAlert size={32} className="text-yellow-500" />
          </div>
          <h3 className="font-bold text-lg text-secondary-800 mb-2">Restricted Access</h3>
          <p className="text-sm text-secondary-500 max-w-md">
            Excel upload is available to <strong>Super Admin only</strong>. Contact the super admin to update APS exam data.
          </p>
        </div>
      )}

      {parsedData && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card overflow-hidden">
          <div className="p-4 border-b border-primary-100 flex items-center justify-between bg-white">
            <h3 className="font-semibold text-secondary-900 flex items-center gap-2">
              <CheckCircle2 size={20} className="text-green-500" /> Preview ({parsedData.length} Records)
            </h3>
            <button onClick={handleUploadToDatabase} disabled={loading} className="btn-primary flex items-center gap-2">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              Save to Database
            </button>
          </div>
          
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-primary-50 sticky top-0 z-10">
                <tr>
                  <th className="text-left px-4 py-3 text-secondary-600 font-semibold text-xs uppercase">Exam</th>
                  <th className="text-left px-4 py-3 text-secondary-600 font-semibold text-xs uppercase">Stream</th>
                  <th className="text-left px-4 py-3 text-secondary-600 font-semibold text-xs uppercase">App Window</th>
                  <th className="text-left px-4 py-3 text-secondary-600 font-semibold text-xs uppercase">Exam Period</th>
                  <th className="text-left px-4 py-3 text-secondary-600 font-semibold text-xs uppercase">Colleges</th>
                  <th className="text-left px-4 py-3 text-secondary-600 font-semibold text-xs uppercase">Website</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-100">
                {parsedData.map((row, i) => (
                  <tr key={i} className="hover:bg-primary-50/50">
                    <td className="px-4 py-3 font-medium text-secondary-900">{row['EXAM'] || 'N/A'}</td>
                    <td className="px-4 py-3">
                      {row['STREAM'] ? (
                        <span className={`badge text-xs font-bold ${
                          row['STREAM'].toUpperCase() === 'PCM' ? 'bg-blue-100 text-blue-700' :
                          row['STREAM'].toUpperCase() === 'PCB' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>{row['STREAM'].toUpperCase()}</span>
                      ) : <span className="text-secondary-400 text-xs">Both</span>}
                    </td>
                    <td className="px-4 py-3 text-secondary-600">{row['APPLICATION WINDOW'] || '-'}</td>
                    <td className="px-4 py-3 text-secondary-600">{row['EXAM PERIOD'] || '-'}</td>
                    <td className="px-4 py-3 text-secondary-600 truncate max-w-xs">{row['MAJOR COLLEGES/INSTITUTE'] || '-'}</td>
                    <td className="px-4 py-3 text-secondary-600 truncate max-w-xs">
                      {row['WEBSITE']
                        ? <a href={row['WEBSITE'].startsWith('http') ? row['WEBSITE'] : `https://${row['WEBSITE']}`}
                            target="_blank" rel="noopener noreferrer"
                            className="text-primary-600 hover:underline text-xs">{row['WEBSITE']}</a>
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Existing Exams Section (Superadmin Only) */}
      {isSuperAdmin && !parsedData && (
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-secondary-900">Manage Uploaded Exams</h2>
              <p className="text-secondary-500 text-sm mt-1">View or delete APS exams currently in the database.</p>
            </div>
            {selectedIds.length > 0 && (
              <button 
                onClick={() => handleDelete(selectedIds)}
                className="btn-primary bg-red-600 hover:bg-red-700 shadow-red-500/30 flex items-center gap-2"
              >
                <Trash2 size={16} /> Delete Selected ({selectedIds.length})
              </button>
            )}
          </div>

          {fetching ? (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 border-4 border-primary-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : existingExams.length === 0 ? (
            <div className="card p-8 text-center text-secondary-400">
              <School size={48} className="mx-auto mb-4 text-primary-200" />
              <p>No exams in the database.</p>
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center">
                <button 
                  onClick={toggleSelectAll} 
                  className="text-sm font-semibold text-primary-600 hover:text-primary-800 flex items-center gap-2"
                >
                  <CheckSquare size={16} /> 
                  {selectedIds.length === existingExams.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {existingExams.map((exam) => (
                  <div key={exam.id} className={`bg-white rounded-2xl shadow-sm border ${selectedIds.includes(exam.id) ? 'border-primary-500 ring-2 ring-primary-500/20' : 'border-gray-200'} relative flex flex-col p-5 transition-all`}>
                    
                    {/* Checkbox and Delete Row */}
                    <div className="flex justify-between items-start mb-3">
                      <div 
                        className="flex items-center justify-center w-6 h-6 rounded border cursor-pointer transition-colors"
                        onClick={() => toggleSelect(exam.id)}
                        style={{ borderColor: selectedIds.includes(exam.id) ? '#3b82f6' : '#d1d5db', backgroundColor: selectedIds.includes(exam.id) ? '#3b82f6' : 'transparent' }}
                      >
                        {selectedIds.includes(exam.id) && <CheckCircle2 size={14} className="text-white" />}
                      </div>
                      
                      <button 
                        onClick={() => handleDelete([exam.id])}
                        className="text-red-400 hover:text-red-600 p-1 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete Exam"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Top Row: icon + badges */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-11 h-11 bg-primary-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow">
                        <Bell size={20} className="text-white" />
                      </div>
                      <div className="flex flex-col gap-1 items-end">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                          Exam Alert
                        </span>
                        {exam.stream && (
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border border-transparent ${
                            exam.stream.toUpperCase() === 'PCM' ? 'bg-blue-100 text-blue-700' :
                            exam.stream.toUpperCase() === 'PCB' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {exam.stream.toUpperCase() === 'PCM' ? 'Engineering' : exam.stream.toUpperCase() === 'PCB' ? 'Medical / Biology' : exam.stream}
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="font-display text-lg font-bold text-secondary-900 mb-2 leading-snug">
                      {exam.exam_name}
                    </h3>

                    {(exam.colleges || exam.courses) && (
                      <p className="text-sm text-secondary-500 leading-relaxed mb-4 flex-1">
                        {exam.colleges ? `${exam.colleges}. ` : ''}
                        {exam.courses ? `Courses: ${exam.courses}.` : ''}
                      </p>
                    )}

                    <div className="border-t border-gray-100 pt-3 mt-auto space-y-2">
                      {exam.exam_period && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar size={14} className="text-primary-500 flex-shrink-0" />
                          <span className="text-secondary-500 font-medium">Exam Period:</span>
                          <span className="text-secondary-800 font-semibold">{exam.exam_period}</span>
                        </div>
                      )}

                      {exam.app_window && (
                        <div className="flex items-center gap-2 text-sm flex-wrap">
                          <Clock size={14} className="text-red-400 flex-shrink-0" />
                          <span className="text-secondary-500 font-medium">Apply By:</span>
                          <span className="text-red-500 font-semibold">{exam.app_window}</span>
                        </div>
                      )}

                      {exam.website && (
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <a
                            href={exam.website.startsWith('http') ? exam.website : `https://${exam.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-primary-600 hover:text-primary-700 font-semibold text-sm transition-colors flex-shrink-0"
                          >
                            <ExternalLink size={14} />
                            Official Website
                          </a>
                          <span className="text-secondary-300 text-xs">|</span>
                          <span className="text-secondary-400 text-xs truncate max-w-[140px]" title={exam.website}>
                            {exam.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </AdminLayout>
  )
}
