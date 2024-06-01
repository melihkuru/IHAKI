from django.contrib.auth.models import User
from django.db import models

from Core.models.category import Category


class UAV(models.Model):
    # Kategori, user gibi varlık silimlerinde İHA'lar etkilensin istemiyorum. bu sebeple SET.NULL ve nullable yaptım.
    name = models.CharField(max_length=255)
    codename = models.CharField(max_length=255)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='uavs')
    inventory_number = models.CharField(max_length=50)
    last_longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    last_latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    lease_disabled = models.BooleanField(default=False)
    brand = models.CharField(max_length=255)
    model = models.CharField(max_length=255)
    weight = models.FloatField()
    takeoff_weight = models.FloatField()
    flight_range = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    is_deleted = models.BooleanField(default=False)
    create_date = models.DateTimeField(auto_now_add=True)
    update_date = models.DateTimeField(auto_now=True)
    delete_date = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.name
