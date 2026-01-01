import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getUserStats, getGameHistory } from '../api'

export default function Statistics({ telegramId, toast }) {
  const [stats, setStats] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [telegramId])

  const loadData = async () => {
    const [statsData, historyData] = await Promise.all([
      getUserStats(telegramId),
      getGameHistory(telegramId)
    ])
    
    setStats(statsData)
    setHistory(historyData)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="text-4xl mb-4">📊</div>
        <div>Loading statistics...</div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-10">
        <div className="text-4xl mb-4">⚠️</div>
        <div>Failed to load statistics</div>
      </div>
    )
  }

  const winRate = stats.games_played > 0 
    ? ((stats.total_won / (stats.total_won + stats.total_lost)) * 100).toFixed(1)
    : 0

  return (
    <div>
      <Link to="/" className="text-gray-500 hover:text-gray-300 block mb-4">← Back</Link>
      <h2 className="text-2xl font-bold mb-4">📊 Statistics</h2>
      
      <div className="space-y-4">
        {/* Balance Card */}
        <motion.div 
          className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-sm opacity-80 mb-1">Current Balance</div>
          <div className="text-4xl font-bold">{stats.balance.toFixed(2)} pts</div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div 
            className="bg-dark-800 rounded-xl p-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="text-gray-400 text-sm mb-1">Games Played</div>
            <div className="text-2xl font-bold">{stats.games_played}</div>
          </motion.div>

          <motion.div 
            className="bg-dark-800 rounded-xl p-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="text-gray-400 text-sm mb-1">Win Rate</div>
            <div className="text-2xl font-bold text-green-400">{winRate}%</div>
          </motion.div>

          <motion.div 
            className="bg-dark-800 rounded-xl p-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-gray-400 text-sm mb-1">Total Wagered</div>
            <div className="text-2xl font-bold">{stats.total_wagered.toFixed(2)}</div>
          </motion.div>

          <motion.div 
            className="bg-dark-800 rounded-xl p-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-gray-400 text-sm mb-1">Total Won</div>
            <div className="text-2xl font-bold text-green-400">{stats.total_won.toFixed(2)}</div>
          </motion.div>

          <motion.div 
            className="bg-dark-800 rounded-xl p-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-gray-400 text-sm mb-1">Total Lost</div>
            <div className="text-2xl font-bold text-red-400">{stats.total_lost.toFixed(2)}</div>
          </motion.div>

          <motion.div 
            className={`bg-dark-800 rounded-xl p-4 ${stats.profit >= 0 ? 'ring-2 ring-green-500' : 'ring-2 ring-red-500'}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-gray-400 text-sm mb-1">Net Profit</div>
            <div className={`text-2xl font-bold ${stats.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {stats.profit >= 0 ? '+' : ''}{stats.profit.toFixed(2)}
            </div>
          </motion.div>
        </div>

        {/* Recent Games */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-xl font-bold mb-3">Recent Games</h3>
          <div className="space-y-2">
            {history.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No games played yet
              </div>
            ) : (
              history.slice(0, 10).map((game, i) => (
                <motion.div 
                  key={game.id}
                  className="bg-dark-800 rounded-lg p-3 flex items-center justify-between"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + (i * 0.05) }}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">
                      {game.game_type === 'plinko' && '🎯'}
                      {game.game_type === 'slots' && '🎰'}
                      {game.game_type === 'wheel' && '🎡'}
                      {game.game_type === 'cards' && '🃏'}
                      {game.game_type === 'mining' && '⛏️'}
                    </div>
                    <div>
                      <div className="font-semibold capitalize">{game.game_type}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(game.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${game.result === 'win' ? 'text-green-400' : 'text-red-400'}`}>
                      {game.result === 'win' ? '+' : '-'}{Math.abs(game.points_change).toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {game.multiplier}x
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
