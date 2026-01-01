import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'

export default function Toast({ message, type = 'error', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 4000)
    
    return () => clearTimeout(timer)
  }, [onClose])

  const icons = {
    error: '❌',
    success: '✅',
    warning: '⚠️',
    info: 'ℹ️'
  }

  const colors = {
    error: 'from-red-600 to-red-700',
    success: 'from-green-600 to-green-700',
    warning: 'from-yellow-600 to-yellow-700',
    info: 'from-blue-600 to-blue-700'
  }

  return (
    <motion.div
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4"
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <div className={`bg-gradient-to-r ${colors[type]} rounded-xl shadow-2xl p-4 flex items-center gap-3`}>
        <div className="text-3xl">{icons[type]}</div>
        <div className="flex-1 text-white font-medium">{message}</div>
        <button 
          onClick={onClose}
          className="text-white/80 hover:text-white text-xl"
        >
          ×
        </button>
      </div>
    </motion.div>
  )
}

export function ToastContainer({ toasts, removeToast }) {
  return (
    <AnimatePresence>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </AnimatePresence>
  )
}
