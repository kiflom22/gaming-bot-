import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { playGame } from '../api'

const ROWS = 12
const MULTIPLIERS = [10, 5, 2, 1.5, 1, 0.5, 0.3, 0.5, 1, 1.5, 2, 5, 10]
const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#22c55e', '#3b82f6', '#3b82f6', '#22c55e', '#22c55e', '#eab308', '#f97316', '#ef4444']

export default function Plinko({ telegramId, updateBalance, toast }) {
  const [betAmount, setBetAmount] = useState(10)
  const [balls, setBalls] = useState([])
  const [result, setResult] = useState(null)
  const [dropping, setDropping] = useState(false)
  const ballIdRef = useRef(0)

  const dropBall = async () => {
    if (dropping) return
    
    setDropping(true)
    setResult(null)
    
    const ballId = ballIdRef.current++
    const path = []
    let position = 6 // Start center
    
    // Calculate path through pegs
    for (let row = 0; row < ROWS; row++) {
      const goRight = Math.random() > 0.5
      position += goRight ? 0.5 : -0.5
      path.push({ row, position, goRight })
    }
    
    // Final slot (0-12)
    const finalSlot = Math.round(position + 6)
    const clampedSlot = Math.max(0, Math.min(12, finalSlot))
    const multiplier = MULTIPLIERS[clampedSlot]
    
    // Add ball with path
    setBalls(prev => [...prev, { id: ballId, path, currentStep: 0, finalSlot: clampedSlot }])
    
    // Animate through path
    for (let step = 0; step <= ROWS; step++) {
      await new Promise(r => setTimeout(r, 150))
      setBalls(prev => prev.map(b => 
        b.id === ballId ? { ...b, currentStep: step } : b
      ))
    }
    
    // Calculate result
    const won = multiplier >= 1
    const winAmount = betAmount * multiplier
    
    // Call API
    const res = await playGame(telegramId, 'plinko', betAmount, {
      final_slot: clampedSlot,
      multiplier: multiplier,
      won: won
    })
    
    if (res?.error) {
      toast.error(res.error)
      setDropping(false)
      return
    }
    
    if (res) {
      updateBalance(res.new_balance)
    }
    
    setResult({
      won,
      multiplier,
      amount: won ? winAmount - betAmount : betAmount
    })
    
    // Remove ball after delay
    setTimeout(() => {
      setBalls(prev => prev.filter(b => b.id !== ballId))
    }, 1000)
    
    setDropping(false)
  }

  // Calculate ball position
  const getBallPosition = (ball) => {
    if (ball.currentStep === 0) {
      return { x: 50, y: 5 }
    }
    
    const step = Math.min(ball.currentStep, ball.path.length)
    const pathPoint = ball.path[step - 1]
    
    if (!pathPoint) {
      return { x: 50, y: 95 }
    }
    
    const x = 50 + (pathPoint.position - 6) * 7
    const y = 8 + (pathPoint.row + 1) * 7
    
    return { x, y }
  }

  return (
    <div>
      <Link to="/" className="text-gray-500 hover:text-gray-300 block mb-4">← Back</Link>
      <h2 className="text-2xl font-bold mb-4">🎯 Plinko</h2>
      
      <div className="game-container">
        {/* Plinko Board */}
        <div className="relative bg-dark-800 rounded-xl p-4 mb-4 overflow-hidden" style={{ height: 350 }}>
          {/* Pegs */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {Array.from({ length: ROWS }, (_, row) => 
              Array.from({ length: row + 3 }, (_, col) => {
                const x = 50 + (col - (row + 2) / 2) * 7
                const y = 10 + row * 7
                return (
                  <circle
                    key={`${row}-${col}`}
                    cx={x}
                    cy={y}
                    r="1"
                    fill="#4b5563"
                    className="drop-shadow"
                  />
                )
              })
            )}
          </svg>
          
          {/* Balls */}
          {balls.map(ball => {
            const pos = getBallPosition(ball)
            return (
              <motion.div
                key={ball.id}
                className="absolute w-4 h-4 rounded-full bg-yellow-400 shadow-lg"
                style={{
                  boxShadow: '0 0 10px #eab308, 0 0 20px #eab308'
                }}
                initial={{ left: '50%', top: '2%' }}
                animate={{ 
                  left: `${pos.x}%`, 
                  top: `${pos.y}%`,
                }}
                transition={{ 
                  type: 'spring',
                  stiffness: 300,
                  damping: 20
                }}
              />
            )
          })}
          
          {/* Multiplier slots at bottom */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-0.5 px-2">
            {MULTIPLIERS.map((mult, i) => (
              <motion.div
                key={i}
                className="flex-1 text-center py-2 rounded-t text-xs font-bold"
                style={{ 
                  backgroundColor: mult >= 5 ? '#ef4444' : mult >= 2 ? '#f97316' : mult >= 1 ? '#22c55e' : '#3b82f6',
                  maxWidth: 35
                }}
                animate={result && result.multiplier === mult ? {
                  scale: [1, 1.2, 1],
                  boxShadow: ['0 0 0px #fff', '0 0 20px #fff', '0 0 0px #fff']
                } : {}}
                transition={{ repeat: result ? 3 : 0, duration: 0.3 }}
              >
                {mult}x
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Bet Input */}
        <div className="mb-4">
          <label className="block text-sm mb-2">Bet Amount</label>
          <input 
            type="number" 
            value={betAmount}
            onChange={e => setBetAmount(Number(e.target.value))}
            min="1"
            className="input-field"
            disabled={dropping}
          />
        </div>
        
        {/* Drop Button */}
        <motion.button 
          className="btn btn-primary"
          onClick={dropBall}
          disabled={dropping}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {dropping ? '🎱 Dropping...' : '🎯 Drop Ball'}
        </motion.button>
        
        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div 
              className={`text-center p-4 rounded-xl mt-4 ${result.won ? 'bg-green-500/20' : 'bg-red-500/20'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-2xl font-bold mb-1">{result.multiplier}x</p>
              <p className={`text-lg ${result.won ? 'text-green-400' : 'text-red-400'}`}>
                {result.won ? '+' : '-'}{result.amount.toFixed(2)} pts
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Paytable */}
        <div className="mt-4 text-center text-xs text-gray-500">
          Drop the ball and watch it bounce! Land on higher multipliers to win big.
        </div>
      </div>
    </div>
  )
}
