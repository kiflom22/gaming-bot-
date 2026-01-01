import { useState } from 'react'
import { Link } from 'react-router-dom'
import { playGame } from '../api'

const symbols = ['🍒', '🍋', '🍊', '🍇', '⭐', '💎']

export default function Slots({ telegramId, updateBalance, toast }) {
  const [betAmount, setBetAmount] = useState(10)
  const [reels, setReels] = useState(['🍒', '🍋', '🍊'])
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState(null)

  const spin = async () => {
    if (spinning) return

    setSpinning(true)
    setResult(null)

    const interval = setInterval(() => {
      setReels([
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
      ])
    }, 100)

    const res = await playGame(telegramId, 'slots', betAmount)

    setTimeout(() => {
      clearInterval(interval)

      if (res?.error) {
        toast.error(res.error)
        setSpinning(false)
        return
      }

      let finalSymbols
      if (res && res.result === 'win') {
        if (res.multiplier >= 10) {
          finalSymbols = ['💎', '💎', '💎']
        } else if (res.multiplier >= 3) {
          finalSymbols = ['🍋', '🍋', '🍋']
        } else {
          finalSymbols = ['🍒', '🍒', '🍒']
        }
      } else {
        finalSymbols = [
          symbols[Math.floor(Math.random() * 4)],
          symbols[Math.floor(Math.random() * 4)],
          symbols[Math.floor(Math.random() * 4)]
        ]
        if (finalSymbols[0] === finalSymbols[1] && finalSymbols[1] === finalSymbols[2]) {
          finalSymbols[2] = symbols[(symbols.indexOf(finalSymbols[2]) + 1) % symbols.length]
        }
      }

      setReels(finalSymbols)

      if (res) {
        updateBalance(res.new_balance)
        setResult({
          won: res.result === 'win',
          amount: Math.abs(res.points_change),
          multiplier: res.multiplier
        })
      }

      setSpinning(false)
    }, 2000)
  }

  return (
    <div>
      <Link to="/" className="text-gray-500 hover:text-gray-300 block mb-4">← Back to Lobby</Link>
      <h2 className="text-2xl font-bold mb-4">🎰 Slots</h2>
      
      <div className="game-container">
        {/* Reels */}
        <div className="flex justify-center gap-3 my-6">
          {reels.map((symbol, i) => (
            <div 
              key={i} 
              className={`w-20 h-20 bg-dark-800 rounded-xl flex items-center justify-center text-4xl border-2 border-dark-600 ${spinning ? 'animate-bounce' : ''}`}
            >
              {symbol}
            </div>
          ))}
        </div>

        {/* Bet input */}
        <div className="mb-4">
          <label className="block text-sm mb-2">Bet Amount</label>
          <input 
            type="number" 
            value={betAmount}
            onChange={e => setBetAmount(Number(e.target.value))}
            min="1"
            className="input-field"
          />
        </div>

        {/* Spin button */}
        <button 
          className="btn btn-primary" 
          onClick={spin}
          disabled={spinning}
        >
          🎰 {spinning ? 'Spinning...' : 'SPIN'}
        </button>

        {/* Paytable */}
        <div className="bg-dark-800/50 rounded-lg p-4 mt-4 text-sm">
          <div className="flex justify-between py-1"><span>🍒🍒🍒</span><span>1.5x</span></div>
          <div className="flex justify-between py-1"><span>🍋🍋🍋</span><span>3x</span></div>
          <div className="flex justify-between py-1"><span>💎💎💎</span><span>10x Jackpot!</span></div>
        </div>

        {/* Result */}
        {result && (
          <div className={`text-center p-5 rounded-xl mt-4 ${result.won ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
            <h3 className="text-xl font-bold">
              {result.won ? (result.multiplier >= 10 ? '🎉 JACKPOT!' : '🎉 Winner!') : '😢 No luck'}
            </h3>
            <p className="text-lg">{result.won ? '+' : '-'}{result.amount.toFixed(2)} points</p>
          </div>
        )}
      </div>
    </div>
  )
}
