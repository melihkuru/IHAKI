from django.contrib.auth.models import User
from django.db import models


class Category(models.Model):
    # lease_disabled alanı bu kategoriye ait olan tüm İHA'ları kiralama listesinden kaldırır.
    # Belirli bir İHA tipinin iç kaynak ihtiyacı doğduğunda hızlı müdahale sağlayacaktır.
    name = models.CharField(max_length=150, null=False, blank=False, unique=True, db_index=True)
    description = models.CharField(max_length=500)
    lease_disabled = models.BooleanField(default=False)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    create_date = models.DateTimeField(auto_now_add=True)
    update_date = models.DateTimeField(auto_now=True)

    # Modül bağımsız varlıklarda spesifik tablo ismi vermeye özen gösteriyorum. Bu ilerde kompleks sorgularda join
    # yazmak için işimi kolaylaştıracaktır.
    class Meta:
        db_table = 'category'

    def __str__(self):
        return self.name
