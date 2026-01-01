from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from django.conf import settings
from .models import User, Deposit, Withdrawal
from .serializers import UserSerializer, DepositSerializer, WithdrawalSerializer

@api_view(['POST'])
def telegram_auth(request):
    """Authenticate user via Telegram"""
    telegram_id = request.data.get('telegram_id')
    username = request.data.get('username')
    first_name = request.data.get('first_name')
    last_name = request.data.get('last_name')
    
    if not telegram_id:
        return Response({'error': 'telegram_id is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    user, created = User.objects.get_or_create(
        telegram_id=telegram_id,
        defaults={
            'username': username,
            'first_name': first_name,
            'last_name': last_name,
        }
    )
    
    if not created:
        # Update user info
        user.username = username
        user.first_name = first_name
        user.last_name = last_name
    
    # Check if user is admin
    is_admin = telegram_id in settings.ADMIN_TELEGRAM_IDS
    if is_admin and not user.is_admin:
        user.is_admin = True
    
    user.last_login = timezone.now()
    user.save()
    
    if user.is_banned:
        return Response({'error': 'Your account has been banned'}, status=status.HTTP_403_FORBIDDEN)
    
    serializer = UserSerializer(user)
    return Response({
        'user': serializer.data,
        'is_admin': user.is_admin,
        'message': 'Welcome!' if created else 'Welcome back!'
    })

@api_view(['GET'])
def user_balance(request, telegram_id):
    """Get user balance"""
    try:
        user = User.objects.get(telegram_id=telegram_id)
        return Response({'balance': float(user.balance)})
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def user_stats(request, telegram_id):
    """Get user statistics"""
    try:
        user = User.objects.get(telegram_id=telegram_id)
        return Response({
            'balance': float(user.balance),
            'total_wagered': float(user.total_wagered),
            'total_won': float(user.total_won),
            'total_lost': float(user.total_lost),
            'games_played': user.games_played,
            'profit': float(user.total_won - user.total_lost)
        })
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def request_deposit(request):
    """Request a deposit"""
    telegram_id = request.data.get('telegram_id')
    amount = request.data.get('amount')
    points = request.data.get('points')
    payment_proof = request.data.get('payment_proof', '')
    
    try:
        user = User.objects.get(telegram_id=telegram_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    deposit = Deposit.objects.create(
        user=user,
        amount=amount,
        points=points,
        payment_proof=payment_proof
    )
    
    serializer = DepositSerializer(deposit)
    return Response({
        'message': 'Deposit request submitted. Waiting for admin approval.',
        'deposit': serializer.data
    }, status=status.HTTP_201_CREATED)

@api_view(['GET'])
def user_deposits(request, telegram_id):
    """Get user deposit history"""
    try:
        user = User.objects.get(telegram_id=telegram_id)
        deposits = user.deposits.all()[:20]
        serializer = DepositSerializer(deposits, many=True)
        return Response(serializer.data)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def request_withdrawal(request):
    """Request a withdrawal"""
    telegram_id = request.data.get('telegram_id')
    points = float(request.data.get('points', 0))
    payment_method = request.data.get('payment_method')
    payment_details = request.data.get('payment_details')
    
    try:
        user = User.objects.get(telegram_id=telegram_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Validate minimum withdrawal
    if points < settings.MINIMUM_WITHDRAWAL:
        return Response({
            'error': f'Minimum withdrawal is {settings.MINIMUM_WITHDRAWAL} points'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Check balance
    if user.balance < points:
        return Response({'error': 'Insufficient balance'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Deduct points from balance
    user.balance -= points
    user.save()
    
    # Calculate amount in Birr (1 point = 1 Birr)
    amount = points
    
    withdrawal = Withdrawal.objects.create(
        user=user,
        points=points,
        amount=amount,
        payment_method=payment_method,
        payment_details=payment_details
    )
    
    serializer = WithdrawalSerializer(withdrawal)
    return Response({
        'message': 'Withdrawal request submitted. Admin will process it soon.',
        'withdrawal': serializer.data
    }, status=status.HTTP_201_CREATED)

@api_view(['GET'])
def user_withdrawals(request, telegram_id):
    """Get user withdrawal history"""
    try:
        user = User.objects.get(telegram_id=telegram_id)
        withdrawals = user.withdrawals.all()[:20]
        serializer = WithdrawalSerializer(withdrawals, many=True)
        return Response(serializer.data)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def check_admin(request, telegram_id):
    """Check if user is admin"""
    try:
        user = User.objects.get(telegram_id=telegram_id)
        return Response({
            'is_admin': user.is_admin,
            'telegram_id': telegram_id
        })
    except User.DoesNotExist:
        return Response({'is_admin': False}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def admin_get_users(request):
    """Get all users (admin only)"""
    telegram_id = request.GET.get('admin_id')
    
    try:
        admin = User.objects.get(telegram_id=telegram_id)
        if not admin.is_admin:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
    except User.DoesNotExist:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
    
    users = User.objects.all().order_by('-created_at')
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def admin_add_points(request):
    """Add points to user (admin only)"""
    admin_id = request.data.get('admin_id')
    user_id = request.data.get('user_id')
    points = request.data.get('points', 0)
    
    try:
        admin = User.objects.get(telegram_id=admin_id)
        if not admin.is_admin:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
    except User.DoesNotExist:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        user = User.objects.get(id=user_id)
        user.balance += points
        user.save()
        return Response({'message': f'Added {points} points to {user.username}', 'new_balance': float(user.balance)})
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def admin_ban_user(request):
    """Ban/unban user (admin only)"""
    admin_id = request.data.get('admin_id')
    user_id = request.data.get('user_id')
    ban = request.data.get('ban', True)
    
    try:
        admin = User.objects.get(telegram_id=admin_id)
        if not admin.is_admin:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
    except User.DoesNotExist:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        user = User.objects.get(id=user_id)
        user.is_banned = ban
        user.is_active = not ban
        user.save()
        return Response({'message': f'User {"banned" if ban else "unbanned"}'})
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def admin_get_deposits(request):
    """Get all deposits (admin only)"""
    admin_id = request.GET.get('admin_id')
    
    try:
        admin = User.objects.get(telegram_id=admin_id)
        if not admin.is_admin:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
    except User.DoesNotExist:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
    
    deposits = Deposit.objects.all().order_by('-created_at')
    serializer = DepositSerializer(deposits, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def admin_approve_deposit(request):
    """Approve deposit (admin only)"""
    admin_id = request.data.get('admin_id')
    deposit_id = request.data.get('deposit_id')
    
    try:
        admin = User.objects.get(telegram_id=admin_id)
        if not admin.is_admin:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
    except User.DoesNotExist:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        deposit = Deposit.objects.get(id=deposit_id)
        if deposit.status != 'pending':
            return Response({'error': 'Deposit already processed'}, status=status.HTTP_400_BAD_REQUEST)
        
        deposit.status = 'approved'
        deposit.processed_at = timezone.now()
        deposit.processed_by = admin.username
        deposit.save()
        
        # Add points to user
        deposit.user.balance += deposit.points
        deposit.user.save()
        
        return Response({'message': 'Deposit approved and points added'})
    except Deposit.DoesNotExist:
        return Response({'error': 'Deposit not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def admin_get_withdrawals(request):
    """Get all withdrawals (admin only)"""
    admin_id = request.GET.get('admin_id')
    
    try:
        admin = User.objects.get(telegram_id=admin_id)
        if not admin.is_admin:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
    except User.DoesNotExist:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
    
    withdrawals = Withdrawal.objects.all().order_by('-created_at')
    serializer = WithdrawalSerializer(withdrawals, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def admin_process_withdrawal(request):
    """Approve/reject/mark as paid withdrawal (admin only)"""
    admin_id = request.data.get('admin_id')
    withdrawal_id = request.data.get('withdrawal_id')
    action = request.data.get('action')  # 'approve', 'reject', 'paid'
    
    try:
        admin = User.objects.get(telegram_id=admin_id)
        if not admin.is_admin:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
    except User.DoesNotExist:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        withdrawal = Withdrawal.objects.get(id=withdrawal_id)
        
        if action == 'approve':
            withdrawal.status = 'approved'
            withdrawal.processed_at = timezone.now()
            withdrawal.processed_by = admin.username
            withdrawal.save()
            return Response({'message': 'Withdrawal approved'})
        
        elif action == 'reject':
            if withdrawal.status == 'pending':
                withdrawal.status = 'rejected'
                withdrawal.processed_at = timezone.now()
                withdrawal.processed_by = admin.username
                withdrawal.save()
                
                # Refund points
                withdrawal.user.balance += withdrawal.points
                withdrawal.user.save()
                
                return Response({'message': 'Withdrawal rejected and points refunded'})
            return Response({'error': 'Can only reject pending withdrawals'}, status=status.HTTP_400_BAD_REQUEST)
        
        elif action == 'paid':
            withdrawal.status = 'paid'
            withdrawal.processed_at = timezone.now()
            withdrawal.save()
            return Response({'message': 'Marked as paid'})
        
        return Response({'error': 'Invalid action'}, status=status.HTTP_400_BAD_REQUEST)
    except Withdrawal.DoesNotExist:
        return Response({'error': 'Withdrawal not found'}, status=status.HTTP_404_NOT_FOUND)
