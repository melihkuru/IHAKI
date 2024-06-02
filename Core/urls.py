from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, LeaseViewSet, UavViewSet, CustomerViewSet

router = DefaultRouter()
router.register(r'category', CategoryViewSet)
router.register(r'uav', UavViewSet)
router.register(r'lease', LeaseViewSet)
router.register(r'customer', CustomerViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
