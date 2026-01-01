from django.contrib import admin
from .models import GameSession

@admin.register(GameSession)
class GameSessionAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'game_type', 'bet_amount', 'result', 'multiplier', 'points_change', 'balance_after', 'created_at']
    list_filter = ['game_type', 'result', 'created_at']
    search_fields = ['user__telegram_id', 'user__username']
    readonly_fields = ['created_at']
    date_hierarchy = 'created_at'
    
    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False
