import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Lobby from './pages/Lobby'
import Plinko from './pages/Plinko'
import Mining from './pages/Mining'
import Slots from './pages/Slots'
import Wheel from './pages/Wheel'
import Cards from './pages/Cards'
import Transactions from './pages/Transactions'
import Statistics from './pages/Statistics'
import AdminDashboard from './pages/AdminDashboard'
import { authenticateUser, getUserBalance, getGameStatus } from './api'
import { ToastContainer } from './components/Toast'
import { useToast } from './hooks/useToast'

const tg = window.Telegram?.WebApp

export default function App() {
  const [balance, setBalance] = useState(0)
  const [telegramId, setTelegramId] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [gameStatuses, setGameStatuses] = useState({})
  const toast = useToast()

  useEffect(() => {
    initApp()
  }, [])

  const initApp = async () => {
    if (tg) {
      tg.ready()
      tg.expand()
      const telegramUser = tg.initDataUnsafe?.user
      
      if (telegramUser?.id) {
        // Authenticate with backend
      const authData = await authenticateUser(telegramUser)
      if (authData?.error) {
        toast.error(authData.error)
        setLoading(false)
        return
      }
      if (authData) {
        setUser(authData.user)
        setTelegramId(telegramUser.id)
        setBalance(Number(authData.user.balance) || 0)
        setIsAdmin(authData.is_admin || false)
      }
      }
    }
    
    // For testing without Telegram (DEVELOPMENT ONLY)
    if (!tg || !tg.initDataUnsafe?.user) {
      console.log('Testing mode: No Telegram context detected')
      // Create test user in backend
      const testUser = {
        id: 12345,
        username: 'testuser',
        first_name: 'Test',
        last_name: 'User'
      }
      const authData = await authenticateUser(testUser)
      if (authData?.error) {
        toast.error(authData.error)
        setLoading(false)
        return
      }
      if (authData) {
        setUser(authData.user)
        setTelegramId(testUser.id)
        setBalance(Number(authData.user.balance) || 0)
        setIsAdmin(authData.is_admin || false)
      }
    }
    
    // Load game statuses
    const statuses = await getGameStatus()
    setGameStatuses(statuses)
    
    setLoading(false)
  }

  const loadBalance = async (id) => {
    const newBalance = await getUserBalance(id)
    setBalance(newBalance)
  }

  const updateBalance = (newBalance) => {
    setBalance(newBalance)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🎮</div>
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    )
  }

  // Removed Telegram check for development testing

  return (
    <>
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
      
      <div className="min-h-screen p-4 max-w-lg mx-auto">
        <div className="flex justify-between items-center p-4 bg-dark-700 rounded-xl mb-4">
          <span className="text-lg font-semibold">🎮 Gaming Bot</span>
          <span className="text-lg font-bold text-green-400">💰 {Number(balance).toFixed(2)} pts</span>
        </div>
        
        <Routes>
          <Route path="/" element={<Lobby balance={balance} gameStatuses={gameStatuses} />} />
          <Route path="/plinko" element={<Plinko telegramId={telegramId} updateBalance={updateBalance} toast={toast} gameStatuses={gameStatuses} />} />
          <Route path="/mining" element={<Mining telegramId={telegramId} updateBalance={updateBalance} toast={toast} gameStatuses={gameStatuses} />} />
          <Route path="/slots" element={<Slots telegramId={telegramId} updateBalance={updateBalance} toast={toast} gameStatuses={gameStatuses} />} />
          <Route path="/wheel" element={<Wheel telegramId={telegramId} updateBalance={updateBalance} toast={toast} gameStatuses={gameStatuses} />} />
          <Route path="/cards" element={<Cards telegramId={telegramId} updateBalance={updateBalance} toast={toast} gameStatuses={gameStatuses} />} />
          <Route path="/transactions" element={<Transactions telegramId={telegramId} balance={balance} updateBalance={updateBalance} toast={toast} />} />
          <Route path="/statistics" element={<Statistics telegramId={telegramId} toast={toast} />} />
          <Route path="/admin" element={<AdminDashboard telegramId={telegramId} isAdmin={isAdmin} toast={toast} />} />
        </Routes>
      </div>
    </>
  )
}
