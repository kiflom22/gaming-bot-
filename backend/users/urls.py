from django.urls import path
from . import views

urlpatterns = [
    path('auth/', views.telegram_auth, name='telegram-auth'),
    path('<int:telegram_id>/balance/', views.user_balance, name='user-balance'),
    path('<int:telegram_id>/stats/', views.user_stats, name='user-stats'),
    path('deposit/', views.request_deposit, name='request-deposit'),
    path('<int:telegram_id>/deposits/', views.user_deposits, name='user-deposits'),
    path('withdrawal/', views.request_withdrawal, name='request-withdrawal'),
    path('<int:telegram_id>/withdrawals/', views.user_withdrawals, name='user-withdrawals'),
    
    # Admin endpoints
    path('admin/check/<int:telegram_id>/', views.check_admin, name='check-admin'),
    path('admin/users/', views.admin_get_users, name='admin-users'),
    path('admin/add-points/', views.admin_add_points, name='admin-add-points'),
    path('admin/ban-user/', views.admin_ban_user, name='admin-ban-user'),
    path('admin/deposits/', views.admin_get_deposits, name='admin-deposits'),
    path('admin/approve-deposit/', views.admin_approve_deposit, name='admin-approve-deposit'),
    path('admin/withdrawals/', views.admin_get_withdrawals, name='admin-withdrawals'),
    path('admin/process-withdrawal/', views.admin_process_withdrawal, name='admin-process-withdrawal'),
]
