from django.urls import path
from . import views

urlpatterns = [
    path('', views.app_view, name='app_view'),
    path('Login/', views.login_process, name='aero_lease_login'),
    path('SignUp/', views.signup_process, name='aero_lease_sign_up'),
]
