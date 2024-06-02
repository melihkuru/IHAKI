"""
URL configuration for IHAKI project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.urls import path

import AeroAdmin.views
import AeroLease.views
from IHAKI.views import home_view, not_login_view

urlpatterns = [
    path('', home_view),
    path('NotLoginRedirect', not_login_view),
    path('AeroSuperAdmin/', admin.site.urls),
    path('AeroAdmin/', AeroAdmin.views.app_view),
    path('AeroAdmin/Login/', AeroAdmin.views.login_process, name="aero_admin_login"),
    path('AeroAdmin/Logout/', AeroAdmin.views.logout_process, name="aero_admin_logout"),
    path('AeroLease/', AeroLease.views.app_view),
    path('AeroLease/Login/', AeroLease.views.login_process, name="aero_lease_login"),
    path('AeroLease/SignUp/', AeroLease.views.signup_process, name="aero_lease_sign_up"),
]

urlpatterns += staticfiles_urlpatterns()
