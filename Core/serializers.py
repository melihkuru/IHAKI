from rest_framework import serializers
from .models import Category, UAV, Lease, Customer, Configuration


# Delete date, silinmiş gibi sistem içi kullanılan bilgileri API'den exclude ediyorum.
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        exclude = ['created_by']


class UavSerializer(serializers.ModelSerializer):
    class Meta:
        model = UAV
        exclude = ['is_deleted', 'created_by', 'delete_date']


class LeaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lease
        exclude = ['is_deleted', 'delete_date']


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        exclude = ['is_deleted', 'delete_date']


class ConfigurationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Configuration
        exclude = ['update_date']


class StatsSerializer(serializers.Serializer):
    totalUav = serializers.IntegerField()
    nowLeasedUav = serializers.IntegerField()
    totalCustomer = serializers.IntegerField()
    leaseRatio = serializers.IntegerField()
