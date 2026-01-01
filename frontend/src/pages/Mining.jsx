import { useState } from 'react'
import { Link } from 'react-router-dom'
import { playGame } from '../api'

export default function Mining({ telegramId, updateBalance, toast }) {
  const [betAmount, setBetAmount] = useState(10)
  const [mineCount, setMineCount] = useState(3)
  const [gameActive, setGameActive] = useState(false)
  const [tiles, setTiles] = useState(Array(25).fill({ revealed: false, isMine: false }))
  const [mines, setMines] = useState([])
  const [revealed, setRevealed] = useState(0)
  const [multiplier, setMultiplier] = useState(1.0)
  const [result, setResult] = useState(null)

  const startGame = () => {
    const newMines = []
    while (newMines.length < mineCount) {
      const pos = Math.floor(Math.random() * 25)
      if (!newMines.includes(pos)) newMines.push(pos)
    }
    
    setMines(newMines)
    setTiles(Array(25).fill({ revealed: false, isMine: false }))
    setGameActive(true)
    setRevealed(0)
    setMultiplier(1.0)
    setResult(null)
  }

  const revealTile = async (index) => {
    if (!gameActive || tiles[index].revealed) return

    const newTiles = [...tiles]
    const isMine = mines.includes(index)
    newTiles[index] = { revealed: true, isMine }
    setTiles(newTiles)

    if (isMine) {
      mines.forEach(m => {
        newTiles[m] = { revealed: true, isMine: true }
      })
      setTiles([...newTiles])
      setGameActive(false)

      const res = await playGame(telegramId, 'mining', betAmount, {
        mines: mineCount,
        revealed,
        hit_mine: true
      })

      if (res?.error) {
        toast.error(res.error)
        setGameActive(false)
        return
      }

      if (res) {
        updateBalance(res.new_balance)
        setResult({ won: false, amount: betAmount })
      }
    } else {
      const newRevealed = revealed + 1
      setRevealed(newRevealed)
      const newMult = 1.0 + (newRevealed * 0.2 * (mineCount / 3))
      setMultiplier(Math.round(newMult * 100) / 100)
    }
  }

  const cashOut = async () => {
    if (!gameActive || revealed === 0) return

    setGameActive(false)

    const res = await playGame(telegramId, 'mining', betAmount, {
      mines: mineCount,
      revealed,
      hit_mine: false
    })

    if (res?.error) {
      toast.error(res.error)
      setGameActive(false)
      return
    }

    if (res) {
      updateBalance(res.new_balance)
      setResult({ won: true, amount: res.points_change })
    }
  }

  return (
    <div>
      <Link to="/" className="text-gray-500 hover:text-gray-300 block mb-4">← Back to Lobby</Link>
      <h2 className="text-2xl font-bold mb-4">⛏️ Mines</h2>
      
      <div className="game-container">
        {/* Controls */}
        <div className="flex gap-2 mb-4">
          <input 
            type="number" 
            value={betAmount}
            onChange={e => setBetAmount(Number(e.target.value))}
            placeholder="Bet amount"
            disabled={gameActive}
            className="input-field"
          />
          <select 
            value={mineCount}
            onChange={e => setMineCount(Number(e.target.value))}
            disabled={gameActive}
            className="input-field"
          >
            <option value={3}>3 Mines</option>
            <option value={5}>5 Mines</option>
            <option value={10}>10 Mines</option>
          </select>
        </div>

        {/* Start/Cashout button */}
        {!gameActive ? (
          <button className="btn btn-primary" onClick={startGame}>
            {result ? 'Play Again' : 'Start Game'}
          </button>
        ) : (
          <>
            <div className="text-center text-4xl font-bold text-green-400 my-4 animate-glow">
              {multiplier.toFixed(2)}x
            </div>
            <button 
              className="btn btn-success" 
              onClick={cashOut} 
              disabled={revealed === 0}
            >
              💰 Cash Out
            </button>
          </>
        )}

        {/* Grid */}
        <div className="grid grid-cols-5 gap-2 my-4">
          {tiles.map((tile, i) => (
            <div 
              key={i}
              onClick={() => revealTile(i)}
              className={`
                aspect-square rounded-lg flex items-center justify-center text-2xl cursor-pointer transition-all
                ${!tile.revealed ? 'bg-dark-600 hover:bg-dark-800' : ''}
                ${tile.revealed && tile.isMine ? 'bg-red-500' : ''}
                ${tile.revealed && !tile.isMine ? 'bg-green-500' : ''}
              `}
            >
              {tile.revealed ? (tile.isMine ? '💣' : '💎') : '?'}
            </div>
          ))}
        </div>

        {/* Result */}
        {result && (
          <div className={`text-center p-5 rounded-xl ${result.won ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
            <h3 className="text-xl font-bold">{result.won ? '🎉 Cashed Out!' : '💥 Boom!'}</h3>
            <p className="text-lg">{result.won ? '+' : '-'}{result.amount.toFixed(2)} points</p>
          </div>
        )}
      </div>
    </div>
  )
}
