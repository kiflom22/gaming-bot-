from django.contrib import admin
from django.utils import timezone
from django.contrib import messages
from .models import User, Deposit, Withdrawal

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['telegram_id', 'username', 'balance', 'games_played', 'is_active', 'is_banned', 'created_at']
    list_filter = ['is_active', 'is_banned', 'created_at']
    search_fields = ['telegram_id', 'username', 'first_name', 'last_name']
    readonly_fields = ['created_at', 'updated_at', 'last_login', 'total_wagered', 'total_won', 'total_lost', 'games_played']
    
    fieldsets = (
        ('User Info', {
            'fields': ('telegram_id', 'username', 'first_name', 'last_name')
        }),
        ('Balance & Stats', {
            'fields': ('balance', 'total_wagered', 'total_won', 'total_lost', 'games_played')
        }),
        ('Status', {
            'fields': ('is_active', 'is_banned')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'last_login')
        }),
    )
    
    actions = ['add_points', 'remove_points', 'ban_users', 'unban_users']
    
    def add_points(self, request, queryset):
        points = 100  # You can make this dynamic
        for user in queryset:
            user.balance += points
            user.save()
        self.message_user(request, f"Added {points} points to {queryset.count()} users", messages.SUCCESS)
    add_points.short_description = "Add 100 points to selected users"
    
    def remove_points(self, request, queryset):
        points = 100
        for user in queryset:
            user.balance = max(0, user.balance - points)
            user.save()
        self.message_user(request, f"Removed {points} points from {queryset.count()} users", messages.SUCCESS)
    remove_points.short_description = "Remove 100 points from selected users"
    
    def ban_users(self, request, queryset):
        queryset.update(is_banned=True, is_active=False)
        self.message_user(request, f"Banned {queryset.count()} users", messages.WARNING)
    ban_users.short_description = "Ban selected users"
    
    def unban_users(self, request, queryset):
        queryset.update(is_banned=False, is_active=True)
        self.message_user(request, f"Unbanned {queryset.count()} users", messages.SUCCESS)
    unban_users.short_description = "Unban selected users"

@admin.register(Deposit)
class DepositAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'amount', 'points', 'status', 'created_at', 'processed_at']
    list_filter = ['status', 'created_at']
    search_fields = ['user__telegram_id', 'user__username']
    readonly_fields = ['created_at', 'processed_at']
    
    fieldsets = (
        ('Deposit Info', {
            'fields': ('user', 'amount', 'points', 'payment_proof')
        }),
        ('Status', {
            'fields': ('status', 'admin_note', 'processed_by')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'processed_at')
        }),
    )
    
    actions = ['approve_deposits', 'reject_deposits']
    
    def approve_deposits(self, request, queryset):
        for deposit in queryset.filter(status='pending'):
            deposit.status = 'approved'
            deposit.processed_at = timezone.now()
            deposit.processed_by = request.user.username
            deposit.save()
            
            # Add points to user
            deposit.user.balance += deposit.points
            deposit.user.save()
        
        self.message_user(request, f"Approved {queryset.count()} deposits", messages.SUCCESS)
    approve_deposits.short_description = "Approve selected deposits"
    
    def reject_deposits(self, request, queryset):
        queryset.filter(status='pending').update(
            status='rejected',
            processed_at=timezone.now(),
            processed_by=request.user.username
        )
        self.message_user(request, f"Rejected {queryset.count()} deposits", messages.WARNING)
    reject_deposits.short_description = "Reject selected deposits"

@admin.register(Withdrawal)
class WithdrawalAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'points', 'amount', 'payment_method', 'status', 'created_at', 'processed_at']
    list_filter = ['status', 'payment_method', 'created_at']
    search_fields = ['user__telegram_id', 'user__username']
    readonly_fields = ['created_at', 'processed_at']
    
    fieldsets = (
        ('Withdrawal Info', {
            'fields': ('user', 'points', 'amount', 'payment_method', 'payment_details')
        }),
        ('Status', {
            'fields': ('status', 'admin_note', 'processed_by')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'processed_at')
        }),
    )
    
    actions = ['approve_withdrawals', 'reject_withdrawals', 'mark_as_paid']
    
    def approve_withdrawals(self, request, queryset):
        queryset.filter(status='pending').update(
            status='approved',
            processed_at=timezone.now(),
            processed_by=request.user.username
        )
        self.message_user(request, f"Approved {queryset.count()} withdrawals", messages.SUCCESS)
    approve_withdrawals.short_description = "Approve selected withdrawals"
    
    def reject_withdrawals(self, request, queryset):
        for withdrawal in queryset.filter(status='pending'):
            withdrawal.status = 'rejected'
            withdrawal.processed_at = timezone.now()
            withdrawal.processed_by = request.user.username
            withdrawal.save()
            
            # Refund points to user
            withdrawal.user.balance += withdrawal.points
            withdrawal.user.save()
        
        self.message_user(request, f"Rejected {queryset.count()} withdrawals", messages.WARNING)
    reject_withdrawals.short_description = "Reject selected withdrawals"
    
    def mark_as_paid(self, request, queryset):
        queryset.filter(status='approved').update(
            status='paid',
            processed_at=timezone.now()
        )
        self.message_user(request, f"Marked {queryset.count()} withdrawals as paid", messages.SUCCESS)
    mark_as_paid.short_description = "Mark as paid"
