from rest_framework import serializers
from .models import User, Deposit, Withdrawal

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'telegram_id', 'username', 'first_name', 'last_name', 
                  'balance', 'total_wagered', 'total_won', 'total_lost', 
                  'games_played', 'is_active', 'is_banned', 'created_at']
        read_only_fields = ['id', 'created_at']

class DepositSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deposit
        fields = ['id', 'amount', 'points', 'status', 'payment_proof', 
                  'admin_note', 'created_at', 'processed_at']
        read_only_fields = ['id', 'status', 'admin_note', 'created_at', 'processed_at']

class WithdrawalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Withdrawal
        fields = ['id', 'points', 'amount', 'payment_method', 'payment_details', 
                  'status', 'admin_note', 'created_at', 'processed_at']
        read_only_fields = ['id', 'status', 'admin_note', 'created_at', 'processed_at']
