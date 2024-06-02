from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from Core.models import Category, UAV, Lease, Customer
from Core.serializers import CategorySerializer, LeaseSerializer, UavSerializer, CustomerSerializer


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


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.filter(is_deleted=0)
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated]
