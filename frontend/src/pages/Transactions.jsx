import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { requestWithdrawal, getWithdrawals } from '../api'

export default function Transactions({ telegramId, balance, updateBalance, toast }) {
  const [withdrawAmount, setWithdrawAmount] = useState(500)
  const [paymentMethod, setPaymentMethod] = useState('bank')
  const [paymentDetails, setPaymentDetails] = useState('')
  const [loading, setLoading] = useState(false)

  // Check if user has minimum balance
  if (balance < 500) {
    return (
      <div>
        <Link to="/" className="text-gray-500 hover:text-gray-300 block mb-4">← Back</Link>
        <h2 className="text-2xl font-bold mb-4">💸 Withdrawal</h2>
        
        <div className="text-center py-20">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <div className="text-6xl mb-4">🔒</div>
            <h3 className="text-2xl font-bold mb-2">Insufficient Balance</h3>
            <p className="text-gray-400 mb-2">Minimum withdrawal amount is 500 points</p>
            <div className="text-lg mb-6">
              <span className="text-gray-500">Your balance: </span>
              <span className="text-red-400 font-bold">{balance.toFixed(2)} pts</span>
              <span className="text-gray-500"> (Br {balance.toFixed(2)})</span>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6 max-w-md mx-auto">
              <div className="text-yellow-400 font-bold mb-2">💡 How to get more points:</div>
              <ul className="text-sm text-gray-300 text-left space-y-1">
                <li>• Play games and win</li>
                <li>• Deposit money (1 Birr = 1 Point)</li>
                <li>• Contact admin for deposit</li>
              </ul>
            </div>
            <Link to="/" className="btn btn-primary inline-block">
              🎮 Play Games
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  const handleWithdraw = async () => {
    if (withdrawAmount < 500) {
      toast.error('Minimum withdrawal is 500 points')
      return
    }

    if (withdrawAmount > balance) {
      toast.error('Insufficient balance')
      return
    }

    if (!paymentDetails.trim()) {
      toast.error('Please enter payment details')
      return
    }

    setLoading(true)
    const result = await requestWithdrawal(telegramId, withdrawAmount, paymentMethod, paymentDetails)
    
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Withdrawal request submitted successfully!')
      updateBalance(balance - withdrawAmount)
      setWithdrawAmount(500)
      setPaymentDetails('')
    }
    
    setLoading(false)
  }

  return (
    <div>
      <Link to="/" className="text-gray-500 hover:text-gray-300 block mb-4">← Back</Link>
      <h2 className="text-2xl font-bold mb-4">💸 Withdrawal</h2>
      
      <div className="game-container">
        <div className="bg-dark-800 rounded-xl p-4 mb-4">
          <div className="text-center">
            <div className="text-gray-400 text-sm mb-1">Available Balance</div>
            <div className="text-3xl font-bold text-green-400">{balance.toFixed(2)} pts</div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-2">Withdrawal Amount (Min: 500 pts)</label>
          <input 
            type="number" 
            value={withdrawAmount}
            onChange={e => setWithdrawAmount(Number(e.target.value))}
            min="500"
            step="100"
            className="input-field"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-2">Payment Method</label>
          <select 
            value={paymentMethod}
            onChange={e => setPaymentMethod(e.target.value)}
            className="input-field"
          >
            <option value="bank">Bank Transfer</option>
            <option value="mobile">Mobile Money</option>
            <option value="crypto">Cryptocurrency</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-2">Payment Details</label>
          <textarea 
            value={paymentDetails}
            onChange={e => setPaymentDetails(e.target.value)}
            placeholder="Enter your account number, wallet address, or payment details..."
            className="input-field min-h-[100px]"
            rows="4"
          />
        </div>

        <motion.button 
          className="btn bg-gradient-to-r from-green-600 to-emerald-600 text-white"
          onClick={handleWithdraw}
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? '⏳ Processing...' : '💸 Request Withdrawal'}
        </motion.button>

        <div className="mt-6 p-4 bg-blue-500/10 rounded-xl text-sm text-blue-300">
          <div className="font-bold mb-2">ℹ️ Withdrawal Info:</div>
          <ul className="space-y-1 text-xs">
            <li>• Minimum withdrawal: 500 points (Br 500)</li>
            <li>• Conversion rate: 1 Point = 1 Birr</li>
            <li>• Processing time: 24-48 hours</li>
            <li>• Points deducted immediately</li>
            <li>• Admin will process payment externally</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
