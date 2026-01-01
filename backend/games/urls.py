from django.urls import path
from . import views

urlpatterns = [
    path('play/', views.play_game, name='play-game'),
    path('history/<int:telegram_id>/', views.game_history, name='game-history'),
    path('status/', views.game_status, name='game-status'),
]
