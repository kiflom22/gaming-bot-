import { useNavigate } from 'react-router-dom'

const games = [
  { path: '/cards', icon: '🃏', name: 'Find Joker', desc: 'Track the Joker through the shuffle!', gameType: 'cards' },
  { path: '/wheel', icon: '🎡', name: 'Wheel', desc: 'Spin the wheel of fortune for big wins!', gameType: 'wheel' },
  { path: '/mining', icon: '⛏️', name: 'Mines', desc: 'Reveal gems, avoid mines. Risk vs reward!', gameType: 'mining' },
  { path: '/plinko', icon: '🎯', name: 'Plinko', desc: 'Drop the ball, watch it bounce to big wins!', gameType: 'plinko' },
  { path: '/slots', icon: '🎰', name: 'Slots', desc: 'Spin to win! Up to 10x jackpot!', gameType: 'slots' },
]

const menuItems = [
  { path: '/transactions', icon: '💸', name: 'Withdraw', desc: 'Request withdrawal (min 500 pts)', adminOnly: false, requiresBalance: 500 },
  { path: '/statistics', icon: '📊', name: 'Statistics', desc: 'View your game stats and history', adminOnly: false, requiresBalance: 0 },
  { path: '/admin', icon: '🛡️', name: 'Admin Panel', desc: 'Manage users, deposits & withdrawals', adminOnly: true, requiresBalance: 0 },
]

export default function Lobby({ balance, gameStatuses }) {
  const navigate = useNavigate()

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Choose a Game</h2>
      
      {games.map(game => (
        <div 
          key={game.path} 
          className="game-card"
          onClick={() => navigate(game.path)}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">
                {game.icon} {game.name}
              </h3>
              <p className="text-gray-400 text-sm">
                {game.desc}
              </p>
            </div>
          </div>
        </div>
      ))}

      <h2 className="text-2xl font-bold mb-4 mt-6">Account</h2>
      
      {menuItems.filter(item => !item.adminOnly).map(item => {
        const isLocked = balance < item.requiresBalance
        
        return (
          <div 
            key={item.path} 
            className={`game-card relative ${isLocked ? 'opacity-60' : ''}`}
            onClick={() => !isLocked && navigate(item.path)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">
                  {item.icon} {item.name}
                  {isLocked && <span className="ml-2 text-sm">🔒</span>}
                </h3>
                <p className="text-gray-400 text-sm">
                  {isLocked 
                    ? `Requires ${item.requiresBalance} points (You have ${balance.toFixed(0)})` 
                    : item.desc
                  }
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
