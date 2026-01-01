const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function authenticateUser(telegramUser) {
  try {
    console.log('Authenticating user:', telegramUser)
    const res = await fetch(`${API_BASE}/api/user/auth/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        telegram_id: telegramUser.id,
        username: telegramUser.username,
        first_name: telegramUser.first_name,
        last_name: telegramUser.last_name
      })
    })
    const data = await res.json()
    console.log('Auth response:', data)
    if (data.error) {
      return { error: data.error }
    }
    return data
  } catch (e) {
    console.error('Auth error:', e)
    return { error: 'Cannot connect to backend. Make sure Django server is running.' }
  }
}

export async function playGame(telegramId, gameType, betAmount, gameData = {}) {
  try {
    const res = await fetch(`${API_BASE}/games/api/play/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        telegram_id: telegramId,
        game_type: gameType,
        bet_amount: betAmount,
        game_data: gameData
      })
    })
    const data = await res.json()
    if (data.error) {
      return { error: data.error }
    }
    return data
  } catch (e) {
    return { error: 'Error playing game. Please try again.' }
  }
}

export async function getUserBalance(telegramId) {
  try {
    const res = await fetch(`${API_BASE}/api/user/${telegramId}/balance/`)
    const data = await res.json()
    return data.balance || 0
  } catch (e) {
    console.error('Balance error:', e)
    return 0
  }
}

export async function getUserStats(telegramId) {
  try {
    const res = await fetch(`${API_BASE}/api/user/${telegramId}/stats/`)
    return await res.json()
  } catch (e) {
    console.error('Stats error:', e)
    return null
  }
}

export async function requestWithdrawal(telegramId, points, paymentMethod, paymentDetails) {
  try {
    const res = await fetch(`${API_BASE}/api/user/withdrawal/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        telegram_id: telegramId,
        points,
        payment_method: paymentMethod,
        payment_details: paymentDetails
      })
    })
    const data = await res.json()
    return data
  } catch (e) {
    console.error('Withdrawal error:', e)
    return { error: 'Failed to request withdrawal' }
  }
}

export async function getWithdrawals(telegramId) {
  try {
    const res = await fetch(`${API_BASE}/api/user/${telegramId}/withdrawals/`)
    return await res.json()
  } catch (e) {
    console.error('Withdrawals error:', e)
    return []
  }
}

export async function getGameStatus() {
  try {
    const res = await fetch(`${API_BASE}/games/api/status/`)
    return await res.json()
  } catch (e) {
    console.error('Game status error:', e)
    return {}
  }
}


export async function getGameHistory(telegramId) {
  try {
    const res = await fetch(`${API_BASE}/games/api/history/${telegramId}/`)
    return await res.json()
  } catch (e) {
    console.error('History error:', e)
    return []
  }
}
