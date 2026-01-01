from django.db import models
from users.models import User

class GameSession(models.Model):
    GAME_TYPES = [
        ('plinko', 'Plinko'),
        ('slots', 'Slots'),
        ('wheel', 'Wheel'),
        ('cards', 'Cards'),
        ('mining', 'Mining'),
    ]
    
    RESULT_CHOICES = [
        ('win', 'Win'),
        ('loss', 'Loss'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='game_sessions')
    game_type = models.CharField(max_length=20, choices=GAME_TYPES, db_index=True)
    bet_amount = models.DecimalField(max_digits=10, decimal_places=2)
    result = models.CharField(max_length=10, choices=RESULT_CHOICES)
    multiplier = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    points_change = models.DecimalField(max_digits=10, decimal_places=2)
    balance_after = models.DecimalField(max_digits=12, decimal_places=2)
    game_data = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        db_table = 'game_sessions'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['game_type', '-created_at']),
        ]

    def __str__(self):
        return f"{self.user.telegram_id} - {self.game_type} - {self.result}"
