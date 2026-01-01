import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { playGame } from '../api'

const SEGMENTS = [
  { multiplier: 0, color: '#1e293b', label: '💀' },
  { multiplier: 1.5, color: '#3b82f6', label: '1.5x' },
  { multiplier: 0.5, color: '#6366f1', label: '0.5x' },
  { multiplier: 2, color: '#22c55e', label: '2x' },
  { multiplier: 0, color: '#1e293b', label: '💀' },
  { multiplier: 1.2, color: '#0ea5e9', label: '1.2x' },
  { multiplier: 3, color: '#eab308', label: '3x' },
  { multiplier: 0.5, color: '#6366f1', label: '0.5x' },
  { multiplier: 5, color: '#f97316', label: '5x' },
  { multiplier: 1.5, color: '#3b82f6', label: '1.5x' },
  { multiplier: 0, color: '#1e293b', label: '💀' },
  { multiplier: 10, color: '#ef4444', label: '10x' },
  { multiplier: 2, color: '#22c55e', label: '2x' },
  { multiplier: 0.5, color: '#6366f1', label: '0.5x' },
  { multiplier: 1.2, color: '#0ea5e9', label: '1.2x' },
  { multiplier: 50, color: '#ec4899', label: '🎰 50x' },
]

export default function Wheel({ telegramId, updateBalance, toast }) {
  const [betAmount, setBetAmount] = useState(10)
  const [spinning, setSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [result, setResult] = useState(null)
  const [showWin, setShowWin] = useState(false)
  
  const spin = async () => {
    if (spinning) return
    
    setSpinning(true)
    setResult(null)
    setShowWin(false)
    
    // Random segment
    const winIndex = Math.floor(Math.random() * SEGMENTS.length)
    const segment = SEGMENTS[winIndex]
    
    // Calculate rotation (5-8 full spins + land on segment)
    const spins = 5 + Math.random() * 3
    const segmentAngle = 360 / SEGMENTS.length
    const targetAngle = 360 - (winIndex * segmentAngle) - (segmentAngle / 2)
    const totalRotation = rotation + (spins * 360) + targetAngle
    
    setRotation(totalRotation)
    
    // Wait for spin to complete
    await new Promise(r => setTimeout(r, 5000))
    
    const won = segment.multiplier > 0
    const winAmount = betAmount * segment.multiplier
    
    // API call
    const res = await playGame(telegramId, 'wheel', betAmount, {
      segment: winIndex,
      multiplier: segment.multiplier,
      won
    })
    
    if (res?.error) {
      toast.error(res.error)
      setSpinning(false)
      return
    }
    
    if (res) {
      updateBalance(res.new_balance)
    }
    
    setResult({
      won,
      multiplier: segment.multiplier,
      amount: won ? winAmount - betAmount : betAmount,
      label: segment.label
    })
    
    if (won && segment.multiplier >= 3) {
      setShowWin(true)
    }
    
    setSpinning(false)
  }

  return (
    <div>
      <Link to="/" className="text-gray-500 hover:text-gray-300 block mb-4">← Back</Link>
      <h2 className="text-2xl font-bold mb-4">🎡 Wheel of Fortune</h2>
      
      <div className="game-container">
        {/* Wheel Container */}
        <div className="relative flex justify-center items-center mb-6" style={{ height: 280 }}>
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
            <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[25px] border-l-transparent border-r-transparent border-t-yellow-400 drop-shadow-lg" />
          </div>
          
          {/* Wheel */}
          <motion.div
            className="relative w-64 h-64 rounded-full shadow-2xl"
            style={{
              background: `conic-gradient(${SEGMENTS.map((s, i) => 
                `${s.color} ${i * (360/SEGMENTS.length)}deg ${(i+1) * (360/SEGMENTS.length)}deg`
              ).join(', ')})`,
              boxShadow: '0 0 30px rgba(0,0,0,0.5), inset 0 0 20px rgba(0,0,0,0.3)'
            }}
            animate={{ rotate: rotation }}
            transition={{ 
              duration: 5, 
              ease: [0.2, 0.8, 0.2, 1] // Custom easing for realistic spin
            }}
          >
            {/* Segment labels */}
            {SEGMENTS.map((segment, i) => {
              const angle = (i * (360 / SEGMENTS.length)) + (180 / SEGMENTS.length)
              return (
                <div
                  key={i}
                  className="absolute text-xs font-bold text-white drop-shadow"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: `rotate(${angle}deg) translateY(-100px) rotate(90deg)`,
                    transformOrigin: '0 0'
                  }}
                >
                  {segment.label}
                </div>
              )
            })}
            
            {/* Center circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-dark-800 border-4 border-yellow-400 flex items-center justify-center shadow-lg">
              <span className="text-2xl">🎡</span>
            </div>
          </motion.div>
          
          {/* Glow effect when spinning */}
          {spinning && (
            <motion.div
              className="absolute w-72 h-72 rounded-full"
              style={{ boxShadow: '0 0 60px rgba(234,179,8,0.4)' }}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
            />
          )}
        </div>
        
        {/* Big Win Animation */}
        <AnimatePresence>
          {showWin && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-black/50 z-20 rounded-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="text-center"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-6xl mb-2">🎉</div>
                <div className="text-4xl font-black text-yellow-400">{result?.label}</div>
                <div className="text-2xl text-green-400 mt-2">+{result?.amount.toFixed(2)} pts</div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Bet Input */}
        <div className="mb-4">
          <label className="block text-sm mb-2">Bet Amount</label>
          <input 
            type="number" 
            value={betAmount}
            onChange={e => setBetAmount(Number(e.target.value))}
            min="1"
            className="input-field"
            disabled={spinning}
          />
        </div>
        
        {/* Spin Button */}
        <motion.button 
          className="btn btn-success"
          onClick={spin}
          disabled={spinning}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          animate={spinning ? { opacity: 0.7 } : {}}
        >
          {spinning ? '🎡 Spinning...' : '🎡 Spin the Wheel!'}
        </motion.button>
        
        {/* Result */}
        <AnimatePresence>
          {result && !showWin && (
            <motion.div 
              className={`text-center p-4 rounded-xl mt-4 ${result.won ? 'bg-green-500/20' : 'bg-red-500/20'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-2xl font-bold mb-1">{result.label}</p>
              <p className={`text-lg ${result.won ? 'text-green-400' : 'text-red-400'}`}>
                {result.won ? '+' : '-'}{result.amount.toFixed(2)} pts
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
