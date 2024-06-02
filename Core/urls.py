from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, LeaseViewSet, UavViewSet, CustomerViewSet, ConfigurationViewSet, StatsView

router = DefaultRouter()
router.register(r'category', CategoryViewSet)
router.register(r'uav', UavViewSet)
router.register(r'lease', LeaseViewSet)
router.register(r'customer', CustomerViewSet)
router.register(r'configuration', ConfigurationViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('stats/', StatsView.as_view(), name='stats'),
]
