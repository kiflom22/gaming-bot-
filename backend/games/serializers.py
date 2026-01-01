from rest_framework import serializers
from .models import GameSession

class GameSessionSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = GameSession
        fields = ['id', 'user', 'username', 'game_type', 'bet_amount', 'result', 
                  'multiplier', 'points_change', 'balance_after', 'game_data', 'created_at']
        read_only_fields = ['id', 'created_at']
