from datetime import timedelta

from django.shortcuts import render
from django.utils import timezone
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from Core.models import Category, UAV, Lease, Customer, Configuration, lease
from Core.serializers import CategorySerializer, LeaseSerializer, UavSerializer, CustomerSerializer, \
    ConfigurationSerializer, StatsSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]


class UavViewSet(viewsets.ModelViewSet):
    queryset = UAV.objects.filter(is_deleted=0)
    serializer_class = UavSerializer
    permission_classes = [IsAuthenticated]


class LeaseViewSet(viewsets.ModelViewSet):
    queryset = Lease.objects.all()
    serializer_class = LeaseSerializer
    permission_classes = [IsAuthenticated]


class ConfigurationViewSet(viewsets.ModelViewSet):
    queryset = Configuration.objects.all()
    serializer_class = ConfigurationSerializer
    permission_classes = [IsAuthenticated]


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.filter(is_deleted=0)
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated]


class StatsView(APIView):
    def get(self, request):
        # İstenen verileri elde etmek için gerekli işlemleri yapın
        data = {
            'totalUav': UAV.objects.count(),
            'nowLeasedUav': Lease.objects.filter(lease_start__lte=timezone.now(),
                                                 lease_end__gte=timezone.now()).count(),
            'totalCustomer': Customer.objects.count(),
            'leaseRatio': average_rental_ratio(),
        }
        serializer = StatsSerializer(data)
        return Response(serializer.data)


# 30 günde sahip olduğumuz İHA sayısı ve kiralanan farklı iha sayısı oranını bulup ortalama çıkardım.
def average_rental_ratio():
    today = timezone.now().date()
    start_date = today - timedelta(days=30)
    leases_in_last_30_days = Lease.objects.filter(lease_start__date__gte=start_date, lease_start__date__lte=today)
    distinct_uav_count = leases_in_last_30_days.values('lease_start__date', 'uav').distinct().count()
    total_uav_count = leases_in_last_30_days.values('uav').distinct().count()

    if total_uav_count != 0:
        average_rental_ratio = distinct_uav_count / total_uav_count
    else:
        average_rental_ratio = 0

    return average_rental_ratio
