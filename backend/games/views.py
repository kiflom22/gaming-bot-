from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from users.models import User
from .models import GameSession
from .serializers import GameSessionSerializer
import random
from decimal import Decimal

@api_view(['POST'])
def play_game(request):
    """Main endpoint for playing games"""
    telegram_id = request.data.get('telegram_id')
    game_type = request.data.get('game_type')
    bet_amount = Decimal(str(request.data.get('bet_amount', 0)))
    game_data = request.data.get('game_data', {})
    
    try:
        user = User.objects.get(telegram_id=telegram_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Check if user is banned
    if user.is_banned:
        return Response({'error': 'Your account has been banned'}, status=status.HTTP_403_FORBIDDEN)
    
    # Check balance
    if user.balance < bet_amount:
        return Response({'error': 'Insufficient balance'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Process game based on type
    if game_type == 'plinko':
        result_data = process_plinko(bet_amount, game_data)
    elif game_type == 'slots':
        result_data = process_slots(bet_amount)
    elif game_type == 'wheel':
        result_data = process_wheel(bet_amount, game_data)
    elif game_type == 'cards':
        result_data = process_cards(bet_amount, game_data)
    elif game_type == 'mining':
        result_data = process_mining(bet_amount, game_data)
    else:
        return Response({'error': 'Invalid game type'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Update user balance and stats
    with transaction.atomic():
        user.balance -= bet_amount
        user.total_wagered += bet_amount
        user.games_played += 1
        
        if result_data['result'] == 'win':
            win_amount = bet_amount * result_data['multiplier']
            user.balance += win_amount
            user.total_won += win_amount
            points_change = win_amount - bet_amount
        else:
            user.total_lost += bet_amount
            points_change = -bet_amount
        
        user.save()
        
        # Create game session
        game_session = GameSession.objects.create(
            user=user,
            game_type=game_type,
            bet_amount=bet_amount,
            result=result_data['result'],
            multiplier=result_data['multiplier'],
            points_change=points_change,
            balance_after=user.balance,
            game_data=game_data
        )
    
    return Response({
        'result': result_data['result'],
        'multiplier': float(result_data['multiplier']),
        'points_change': float(points_change),
        'new_balance': float(user.balance),
        'game_data': result_data.get('extra_data', {})
    })

def process_plinko(bet_amount, game_data):
    """Process plinko game"""
    multiplier = Decimal(str(game_data.get('multiplier', 0)))
    won = game_data.get('won', False)
    
    if won and multiplier >= 1:
        return {'result': 'win', 'multiplier': multiplier}
    
    return {'result': 'loss', 'multiplier': Decimal('0')}

def process_slots(bet_amount):
    """Process slots game"""
    # Random outcome
    rand = random.random()
    
    if rand < 0.01:  # 1% chance for jackpot
        return {'result': 'win', 'multiplier': Decimal('10')}
    elif rand < 0.05:  # 4% chance for 3x
        return {'result': 'win', 'multiplier': Decimal('3')}
    elif rand < 0.15:  # 10% chance for 1.5x
        return {'result': 'win', 'multiplier': Decimal('1.5')}
    
    return {'result': 'loss', 'multiplier': Decimal('0')}

def process_wheel(bet_amount, game_data):
    """Process wheel game"""
    multiplier = Decimal(str(game_data.get('multiplier', 0)))
    won = game_data.get('won', False)
    
    if won and multiplier > 0:
        return {'result': 'win', 'multiplier': multiplier}
    
    return {'result': 'loss', 'multiplier': Decimal('0')}

def process_cards(bet_amount, game_data):
    """Process cards game"""
    won = game_data.get('won', False)
    
    if won:
        return {'result': 'win', 'multiplier': Decimal('2.5')}
    
    return {'result': 'loss', 'multiplier': Decimal('0')}

def process_mining(bet_amount, game_data):
    """Process mining game"""
    hit_mine = game_data.get('hit_mine', False)
    revealed = game_data.get('revealed', 0)
    mines = game_data.get('mines', 3)
    
    if not hit_mine and revealed > 0:
        multiplier = Decimal('1.0') + (Decimal(str(revealed)) * Decimal('0.2') * (Decimal(str(mines)) / Decimal('3')))
        return {'result': 'win', 'multiplier': multiplier}
    
    return {'result': 'loss', 'multiplier': Decimal('0')}

@api_view(['GET'])
def game_history(request, telegram_id):
    """Get user game history"""
    try:
        user = User.objects.get(telegram_id=telegram_id)
        sessions = user.game_sessions.all()[:50]
        serializer = GameSessionSerializer(sessions, many=True)
        return Response(serializer.data)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def game_status(request):
    """Get status of all games - all games always enabled"""
    game_types = ['plinko', 'slots', 'wheel', 'cards', 'mining']
    statuses = {}
    
    for game_type in game_types:
        statuses[game_type] = {
            'is_enabled': True,
            'maintenance_message': ''
        }
    
    return Response(statuses)
