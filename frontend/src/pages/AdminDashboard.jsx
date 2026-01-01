import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function AdminDashboard({ telegramId, isAdmin, toast }) {
  const [activeTab, setActiveTab] = useState('users')
  const [users, setUsers] = useState([])
  const [deposits, setDeposits] = useState([])
  const [withdrawals, setWithdrawals] = useState([])
  const [gameSessions, setGameSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAdmin) {
      return
    }
    loadData()
  }, [activeTab, isAdmin])

  if (!isAdmin) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🚫</div>
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-gray-400 mb-6">You don't have permission to access the admin panel.</p>
        <Link to="/" className="btn btn-primary">← Back to Lobby</Link>
      </div>
    )
  }

  const loadData = async () => {
    setLoading(true)
    // Load data based on active tab
    // For now, using mock data
    setTimeout(() => {
      setUsers([
        { id: 1, telegram_id: 12345, username: 'testuser', balance: 1000, games_played: 15 },
        { id: 2, telegram_id: 67890, username: 'player2', balance: 500, games_played: 8 },
      ])
      setDeposits([
        { id: 1, user: 'testuser', amount: 100, points: 1000, status: 'pending', created_at: new Date() },
        { id: 2, user: 'player2', amount: 50, points: 500, status: 'approved', created_at: new Date() },
      ])
      setWithdrawals([
        { id: 1, user: 'testuser', points: 500, amount: 50, status: 'pending', created_at: new Date() },
      ])
      setGameSessions([
        { id: 1, user: 'testuser', game_type: 'plinko', bet_amount: 10, result: 'win', points_change: 15, created_at: new Date() },
        { id: 2, user: 'player2', game_type: 'slots', bet_amount: 20, result: 'loss', points_change: -20, created_at: new Date() },
      ])
      setLoading(false)
    }, 500)
  }

  const tabs = [
    { id: 'users', name: 'Users', icon: '👥' },
    { id: 'deposits', name: 'Deposits', icon: '💰' },
    { id: 'withdrawals', name: 'Withdrawals', icon: '💸' },
    { id: 'games', name: 'Game History', icon: '🎮' },
    { id: 'control', name: 'Game Control', icon: '🎛️' },
  ]

  return (
    <div>
      <Link to="/" className="text-gray-500 hover:text-gray-300 block mb-4">← Back</Link>
      <h2 className="text-2xl font-bold mb-4">🛡️ Admin Dashboard</h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-dark-800 text-gray-400 hover:bg-dark-700'
            }`}
          >
            {tab.icon} {tab.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="text-4xl mb-4">⏳</div>
          <div>Loading...</div>
        </div>
      ) : (
        <>
          {activeTab === 'users' && <UsersTab users={users} setUsers={setUsers} toast={toast} />}
          {activeTab === 'deposits' && <DepositsTab deposits={deposits} setDeposits={setDeposits} toast={toast} />}
          {activeTab === 'withdrawals' && <WithdrawalsTab withdrawals={withdrawals} setWithdrawals={setWithdrawals} toast={toast} />}
          {activeTab === 'games' && <GamesTab gameSessions={gameSessions} />}
          {activeTab === 'control' && <GameControlTab toast={toast} />}
        </>
      )}
    </div>
  )
}

function GameControlTab({ toast }) {
  const [gameControls, setGameControls] = useState([
    { game_type: 'plinko', name: 'Plinko', icon: '🎯', is_enabled: true, maintenance_message: 'Plinko is temporarily under maintenance. We are adding new features!' },
    { game_type: 'slots', name: 'Slots', icon: '🎰', is_enabled: true, maintenance_message: 'Slots is being upgraded. Please check back soon!' },
    { game_type: 'wheel', name: 'Wheel', icon: '🎡', is_enabled: true, maintenance_message: 'Wheel of Fortune is under maintenance. Thank you for your patience!' },
    { game_type: 'cards', name: 'Find Joker', icon: '🃏', is_enabled: true, maintenance_message: 'Find Joker is temporarily unavailable. We are fixing some issues!' },
    { game_type: 'mining', name: 'Mines', icon: '⛏️', is_enabled: true, maintenance_message: 'Mines is under maintenance. Please try again later!' },
  ])
  const [editingGame, setEditingGame] = useState(null)
  const [editMessage, setEditMessage] = useState('')

  const toggleGame = (gameType) => {
    setGameControls(gameControls.map(g => 
      g.game_type === gameType ? { ...g, is_enabled: !g.is_enabled } : g
    ))
    const game = gameControls.find(g => g.game_type === gameType)
    toast.success(`${game.name} ${!game.is_enabled ? 'enabled' : 'disabled'}`)
  }

  const startEditMessage = (game) => {
    setEditingGame(game.game_type)
    setEditMessage(game.maintenance_message)
  }

  const saveMessage = (gameType) => {
    setGameControls(gameControls.map(g => 
      g.game_type === gameType ? { ...g, maintenance_message: editMessage } : g
    ))
    setEditingGame(null)
    toast.success('Maintenance message updated')
  }

  return (
    <div className="space-y-3">
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">ℹ️</span>
          <span className="font-bold text-blue-300">Game Control Panel</span>
        </div>
        <p className="text-sm text-gray-400">
          Enable or disable games for maintenance. Disabled games will show a maintenance message to users.
        </p>
      </div>

      {gameControls.map(game => (
        <motion.div
          key={game.game_type}
          className={`bg-dark-800 rounded-xl p-4 ${!game.is_enabled ? 'ring-2 ring-yellow-500' : ''}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{game.icon}</div>
              <div>
                <div className="font-bold text-lg">{game.name}</div>
                <div className="text-sm">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    game.is_enabled ? 'bg-green-600' : 'bg-red-600'
                  }`}>
                    {game.is_enabled ? '✅ ENABLED' : '🔧 DISABLED'}
                  </span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => toggleGame(game.game_type)}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                game.is_enabled
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {game.is_enabled ? '🔧 Disable' : '✅ Enable'}
            </button>
          </div>

          {/* Maintenance Message */}
          <div className="mt-3 pt-3 border-t border-dark-600">
            <div className="text-sm text-gray-400 mb-2">Maintenance Message:</div>
            
            {editingGame === game.game_type ? (
              <div className="space-y-2">
                <textarea
                  value={editMessage}
                  onChange={e => setEditMessage(e.target.value)}
                  className="input-field min-h-[80px]"
                  placeholder="Enter maintenance message..."
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => saveMessage(game.game_type)}
                    className="btn btn-success flex-1"
                  >
                    💾 Save
                  </button>
                  <button
                    onClick={() => setEditingGame(null)}
                    className="btn bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div 
                className="bg-dark-700 rounded-lg p-3 text-sm text-gray-300 cursor-pointer hover:bg-dark-600"
                onClick={() => startEditMessage(game)}
              >
                <p>{game.maintenance_message}</p>
                <div className="text-xs text-gray-500 mt-2">Click to edit</div>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function UsersTab({ users, setUsers, toast }) {
  const [selectedUser, setSelectedUser] = useState(null)
  const [pointsToAdd, setPointsToAdd] = useState(0)
  const [customAmount, setCustomAmount] = useState(false)

  const quickAmounts = [50, 100, 200, 500, 1000, 2000, 5000]

  const addPoints = (userId) => {
    if (pointsToAdd <= 0) {
      toast.error('Enter a valid amount')
      return
    }
    
    setUsers(users.map(u => 
      u.id === userId ? { ...u, balance: u.balance + pointsToAdd } : u
    ))
    toast.success(`Added ${pointsToAdd} points (Br ${pointsToAdd}) to user`)
    setSelectedUser(null)
    setPointsToAdd(0)
    setCustomAmount(false)
  }

  const selectQuickAmount = (amount) => {
    setPointsToAdd(amount)
    setCustomAmount(false)
  }

  const banUser = (userId) => {
    toast.warning('User banned')
    // API call here
  }

  return (
    <div className="space-y-3">
      {users.map(user => (
        <motion.div
          key={user.id}
          className="bg-dark-800 rounded-xl p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-bold text-lg">@{user.username}</div>
              <div className="text-sm text-gray-400">ID: {user.telegram_id}</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-400">{user.balance} pts</div>
              <div className="text-xs text-gray-500">Br {user.balance} • {user.games_played} games</div>
            </div>
          </div>

          {selectedUser === user.id ? (
            <div className="space-y-3">
              {/* Quick Amount Buttons */}
              <div>
                <div className="text-sm text-gray-400 mb-2">Quick Add:</div>
                <div className="grid grid-cols-4 gap-2">
                  {quickAmounts.map(amount => (
                    <button
                      key={amount}
                      onClick={() => selectQuickAmount(amount)}
                      className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                        pointsToAdd === amount && !customAmount
                          ? 'bg-green-600 text-white'
                          : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                      }`}
                    >
                      {amount}
                    </button>
                  ))}
                  <button
                    onClick={() => setCustomAmount(true)}
                    className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                      customAmount
                        ? 'bg-blue-600 text-white'
                        : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                    }`}
                  >
                    Custom
                  </button>
                </div>
              </div>

              {/* Custom Amount Input */}
              {customAmount && (
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Custom Amount:</label>
                  <input
                    type="number"
                    value={pointsToAdd}
                    onChange={e => setPointsToAdd(Number(e.target.value))}
                    placeholder="Enter points"
                    className="input-field"
                    autoFocus
                  />
                </div>
              )}

              {/* Amount Display */}
              {pointsToAdd > 0 && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
                  <div className="text-sm text-gray-400">Adding:</div>
                  <div className="text-2xl font-bold text-green-400">{pointsToAdd} points</div>
                  <div className="text-sm text-green-300">= Br {pointsToAdd}</div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => addPoints(user.id)}
                  disabled={pointsToAdd <= 0}
                  className="btn btn-success flex-1"
                >
                  ✅ Confirm Add
                </button>
                <button
                  onClick={() => {
                    setSelectedUser(null)
                    setPointsToAdd(0)
                    setCustomAmount(false)
                  }}
                  className="btn bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedUser(user.id)}
                className="btn btn-primary flex-1"
              >
                💰 Add Points
              </button>
              <button
                onClick={() => banUser(user.id)}
                className="btn bg-red-600"
              >
                🚫 Ban
              </button>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}

function DepositsTab({ deposits, setDeposits, toast }) {
  const approveDeposit = (depositId) => {
    setDeposits(deposits.map(d =>
      d.id === depositId ? { ...d, status: 'approved' } : d
    ))
    toast.success('Deposit approved! Points added to user.')
  }

  const rejectDeposit = (depositId) => {
    setDeposits(deposits.map(d =>
      d.id === depositId ? { ...d, status: 'rejected' } : d
    ))
    toast.warning('Deposit rejected')
  }

  return (
    <div className="space-y-3">
      {deposits.map(deposit => (
        <motion.div
          key={deposit.id}
          className={`bg-dark-800 rounded-xl p-4 ${
            deposit.status === 'pending' ? 'ring-2 ring-yellow-500' : ''
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-bold">@{deposit.user}</div>
              <div className="text-sm text-gray-400">
                {new Date(deposit.created_at).toLocaleString()}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold">Br {deposit.amount}</div>
              <div className="text-sm text-green-400">{deposit.points} points</div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${
              deposit.status === 'pending' ? 'bg-yellow-600' :
              deposit.status === 'approved' ? 'bg-green-600' :
              'bg-red-600'
            }`}>
              {deposit.status.toUpperCase()}
            </span>

            {deposit.status === 'pending' && (
              <div className="flex gap-2">
                <button
                  onClick={() => approveDeposit(deposit.id)}
                  className="btn btn-success"
                >
                  ✅ Approve
                </button>
                <button
                  onClick={() => rejectDeposit(deposit.id)}
                  className="btn bg-red-600"
                >
                  ❌ Reject
                </button>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function WithdrawalsTab({ withdrawals, setWithdrawals, toast }) {
  const approveWithdrawal = (withdrawalId) => {
    setWithdrawals(withdrawals.map(w =>
      w.id === withdrawalId ? { ...w, status: 'approved' } : w
    ))
    toast.success('Withdrawal approved! Process payment externally.')
  }

  const markAsPaid = (withdrawalId) => {
    setWithdrawals(withdrawals.map(w =>
      w.id === withdrawalId ? { ...w, status: 'paid' } : w
    ))
    toast.success('Marked as paid')
  }

  const rejectWithdrawal = (withdrawalId) => {
    setWithdrawals(withdrawals.map(w =>
      w.id === withdrawalId ? { ...w, status: 'rejected' } : w
    ))
    toast.warning('Withdrawal rejected. Points refunded.')
  }

  return (
    <div className="space-y-3">
      {withdrawals.map(withdrawal => (
        <motion.div
          key={withdrawal.id}
          className={`bg-dark-800 rounded-xl p-4 ${
            withdrawal.status === 'pending' ? 'ring-2 ring-yellow-500' : ''
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-bold">@{withdrawal.user}</div>
              <div className="text-sm text-gray-400">
                {new Date(withdrawal.created_at).toLocaleString()}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-red-400">{withdrawal.points} pts</div>
              <div className="text-sm text-gray-400">Br {withdrawal.amount}</div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${
              withdrawal.status === 'pending' ? 'bg-yellow-600' :
              withdrawal.status === 'approved' ? 'bg-blue-600' :
              withdrawal.status === 'paid' ? 'bg-green-600' :
              'bg-red-600'
            }`}>
              {withdrawal.status.toUpperCase()}
            </span>

            <div className="flex gap-2">
              {withdrawal.status === 'pending' && (
                <>
                  <button
                    onClick={() => approveWithdrawal(withdrawal.id)}
                    className="btn btn-primary"
                  >
                    ✅ Approve
                  </button>
                  <button
                    onClick={() => rejectWithdrawal(withdrawal.id)}
                    className="btn bg-red-600"
                  >
                    ❌ Reject
                  </button>
                </>
              )}
              {withdrawal.status === 'approved' && (
                <button
                  onClick={() => markAsPaid(withdrawal.id)}
                  className="btn btn-success"
                >
                  💵 Mark as Paid
                </button>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function GamesTab({ gameSessions }) {
  return (
    <div className="space-y-2">
      {gameSessions.map(session => (
        <motion.div
          key={session.id}
          className="bg-dark-800 rounded-lg p-3 flex items-center justify-between"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-3">
            <div className="text-2xl">
              {session.game_type === 'plinko' && '🎯'}
              {session.game_type === 'slots' && '🎰'}
              {session.game_type === 'wheel' && '🎡'}
              {session.game_type === 'cards' && '🃏'}
              {session.game_type === 'mining' && '⛏️'}
            </div>
            <div>
              <div className="font-semibold">@{session.user}</div>
              <div className="text-xs text-gray-500 capitalize">{session.game_type}</div>
            </div>
          </div>
          <div className="text-right">
            <div className={`font-bold ${session.result === 'win' ? 'text-green-400' : 'text-red-400'}`}>
              {session.result === 'win' ? '+' : ''}{session.points_change}
            </div>
            <div className="text-xs text-gray-500">Bet: {session.bet_amount}</div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
