from django.contrib.auth.models import User
from django.db import models


class Category(models.Model):
    # lease_disabled alanı bu kategoriye ait olan tüm İHA'ları kiralama listesinden kaldırır.
    # Belirli bir İHA tipinin iç kaynak ihtiyacı doğduğunda veyahut kiralamaları iptal edilmek
    # istendiğinde hızlı müdahale sağlayacaktır.
    name = models.CharField(max_length=150, null=False, blank=False, unique=True, db_index=True)
    description = models.CharField(max_length=500)
    lease_disabled = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    create_date = models.DateTimeField(auto_now_add=True)
    update_date = models.DateTimeField(auto_now=True)
    delete_date = models.DateTimeField(null=True, blank=True)
