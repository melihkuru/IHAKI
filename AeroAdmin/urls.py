from django.urls import path
from . import views

urlpatterns = [
    path('', views.app_view, name='app_view'),
    path('Login/', views.login_process, name='aero_admin_login'),
    path('Logout/', views.logout_process, name='aero_admin_logout'),
]
