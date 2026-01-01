import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { playGame } from '../api'

const CARDS = ['🃏', '👸', '🤴'] // Joker, Queen, King

export default function Cards({ telegramId, updateBalance, toast }) {
  const [betAmount, setBetAmount] = useState(10)
  const [gamePhase, setGamePhase] = useState('idle') // idle, showing, shuffling, picking, result
  const [cardPositions, setCardPositions] = useState([0, 1, 2])
  const [jokerPosition, setJokerPosition] = useState(0)
  const [selectedCard, setSelectedCard] = useState(null)
  const [revealedCards, setRevealedCards] = useState([])
  const [result, setResult] = useState(null)
  const [shuffleCount, setShuffleCount] = useState(0)

  const startGame = async () => {
    setResult(null)
    setSelectedCard(null)
    setRevealedCards([])
    setCardPositions([0, 1, 2])
    
    // Random joker position
    const jokerPos = Math.floor(Math.random() * 3)
    setJokerPosition(jokerPos)
    
    // Show cards first
    setGamePhase('showing')
    setRevealedCards([0, 1, 2])
    
    await new Promise(r => setTimeout(r, 2000))
    
    // Hide cards
    setRevealedCards([])
    await new Promise(r => setTimeout(r, 500))
    
    // Shuffle animation
    setGamePhase('shuffling')
    
    let positions = [0, 1, 2]
    const shuffles = 5 + Math.floor(Math.random() * 5) // 5-10 shuffles
    
    for (let i = 0; i < shuffles; i++) {
      await new Promise(r => setTimeout(r, 400))
      
      // Swap two random positions
      const idx1 = Math.floor(Math.random() * 3)
      let idx2 = Math.floor(Math.random() * 3)
      while (idx2 === idx1) idx2 = Math.floor(Math.random() * 3)
      
      const newPositions = [...positions]
      const temp = newPositions[idx1]
      newPositions[idx1] = newPositions[idx2]
      newPositions[idx2] = temp
      
      positions = newPositions
      setCardPositions([...positions])
      setShuffleCount(i + 1)
    }
    
    await new Promise(r => setTimeout(r, 300))
    setGamePhase('picking')
  }

  const pickCard = async (position) => {
    if (gamePhase !== 'picking') return
    
    setSelectedCard(position)
    setGamePhase('result')
    
    // Find where joker actually is now
    const jokerCurrentPos = cardPositions.indexOf(jokerPosition)
    const won = position === jokerCurrentPos
    
    // Reveal all cards
    setRevealedCards([0, 1, 2])
    
    // Vibrate on result
    if (navigator.vibrate) {
      navigator.vibrate(won ? [100, 50, 100] : [200])
    }
    
    // API call
    const res = await playGame(telegramId, 'cards', betAmount, {
      jokerPosition: jokerCurrentPos,
      selectedPosition: position,
      won
    })
    
    if (res?.error) {
      toast.error(res.error)
      setGamePhase('idle')
      return
    }
    
    if (res) {
      updateBalance(res.new_balance)
      setResult({
        won,
        amount: Math.abs(res.points_change)
      })
    }
  }

  const getCardAtPosition = (position) => {
    const originalIndex = cardPositions[position]
    if (originalIndex === jokerPosition) return '🃏'
    if (originalIndex === (jokerPosition + 1) % 3) return '👸'
    return '🤴'
  }

  return (
    <div>
      <Link to="/" className="text-gray-500 hover:text-gray-300 block mb-4">← Back</Link>
      <h2 className="text-2xl font-bold mb-4">🃏 Find the Joker</h2>
      
      <div className="game-container">
        {/* Status */}
        <div className="text-center mb-6">
          {gamePhase === 'idle' && (
            <p className="text-gray-400">Find the Joker to win 2.5x!</p>
          )}
          {gamePhase === 'showing' && (
            <motion.p 
              className="text-yellow-400 font-bold"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
            >
              👀 Remember the Joker position!
            </motion.p>
          )}
          {gamePhase === 'shuffling' && (
            <motion.p 
              className="text-blue-400 font-bold"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 0.3 }}
            >
              🔀 Shuffling... ({shuffleCount})
            </motion.p>
          )}
          {gamePhase === 'picking' && (
            <motion.p 
              className="text-green-400 font-bold text-lg"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
            >
              👆 Pick a card!
            </motion.p>
          )}
        </div>
        
        {/* Cards */}
        <div className="flex justify-center gap-4 mb-8" style={{ height: 180 }}>
          {[0, 1, 2].map((position) => {
            const isRevealed = revealedCards.includes(position)
            const isSelected = selectedCard === position
            const card = getCardAtPosition(position)
            const isJoker = card === '🃏'
            const xPos = (position - 1) * 100
            
            return (
              <motion.div
                key={position}
                className="relative"
                style={{ width: 80 }}
                animate={{
                  x: gamePhase === 'shuffling' ? cardPositions.indexOf(cardPositions[position]) * 0 : 0,
                }}
                layout
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                <motion.button
                  className={`w-20 h-32 rounded-xl flex items-center justify-center text-4xl relative overflow-hidden ${
                    isSelected && result?.won ? 'ring-4 ring-green-400' :
                    isSelected && !result?.won ? 'ring-4 ring-red-400' :
                    gamePhase === 'picking' ? 'cursor-pointer' : ''
                  }`}
                  style={{
                    background: isRevealed 
                      ? 'linear-gradient(135deg, #fff 0%, #f0f0f0 100%)'
                      : 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 50%, #172554 100%)',
                    boxShadow: isSelected ? '0 0 30px rgba(255,255,255,0.3)' : '0 10px 30px rgba(0,0,0,0.3)'
                  }}
                  onClick={() => pickCard(position)}
                  disabled={gamePhase !== 'picking'}
                  whileHover={gamePhase === 'picking' ? { 
                    scale: 1.1, 
                    y: -10,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
                  } : {}}
                  whileTap={gamePhase === 'picking' ? { scale: 0.95 } : {}}
                  animate={gamePhase === 'shuffling' ? {
                    rotateY: [0, 180, 360],
                  } : {}}
                  transition={{ duration: 0.4 }}
                >
                  {/* Card back pattern */}
                  {!isRevealed && (
                    <div className="absolute inset-2 border-2 border-blue-400/30 rounded-lg flex items-center justify-center">
                      <motion.div
                        className="text-3xl opacity-30"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                      >
                        ✦
                      </motion.div>
                    </div>
                  )}
                  
                  {/* Card face */}
                  {isRevealed && (
                    <motion.div
                      initial={{ rotateY: 90, opacity: 0 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="text-5xl"
                    >
                      {card}
                    </motion.div>
                  )}
                  
                  {/* Glow effect for joker */}
                  {isRevealed && isJoker && (
                    <motion.div
                      className="absolute inset-0 rounded-xl"
                      animate={{ 
                        boxShadow: ['0 0 20px #fbbf24', '0 0 40px #fbbf24', '0 0 20px #fbbf24']
                      }}
                      transition={{ repeat: Infinity, duration: 0.5 }}
                    />
                  )}
                </motion.button>
                
                {/* Position indicator */}
                <div className="text-center mt-2 text-gray-500 text-sm">
                  {position + 1}
                </div>
              </motion.div>
            )
          })}
        </div>
        
        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div 
              className={`text-center p-5 rounded-xl mb-4 ${result.won ? 'bg-green-500/20' : 'bg-red-500/20'}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {result.won ? (
                <motion.div
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ repeat: 2, duration: 0.3 }}
                >
                  <p className="text-3xl mb-2">🎉🃏🎉</p>
                  <p className="text-xl font-bold text-green-400">+{result.amount.toFixed(2)} pts</p>
                  <p className="text-sm text-gray-400">You found the Joker!</p>
                </motion.div>
              ) : (
                <div>
                  <p className="text-3xl mb-2">😢</p>
                  <p className="text-xl font-bold text-red-400">-{result.amount.toFixed(2)} pts</p>
                  <p className="text-sm text-gray-400">Wrong card!</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Controls */}
        {(gamePhase === 'idle' || gamePhase === 'result') && (
          <>
            <div className="mb-4">
              <label className="block text-sm mb-2 text-gray-400">Bet Amount</label>
              <input 
                type="number" 
                value={betAmount}
                onChange={e => setBetAmount(Number(e.target.value))}
                min="1"
                className="input-field"
              />
            </div>
            
            <motion.button 
              className="btn bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold"
              onClick={startGame}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              🃏 {result ? 'Play Again' : 'Start Game'} (2.5x)
            </motion.button>
          </>
        )}
        
        {/* Instructions */}
        <p className="text-center text-xs text-gray-500 mt-4">
          Watch the Joker, follow the shuffle, pick the right card!
        </p>
      </div>
    </div>
  )
}
