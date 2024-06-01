from django.db import models
from django.contrib.auth.models import User


class Customer(models.Model):
    # Customer silme isteği geldiğine is_deleted 1 yapılacaktır. Ardından veri saklama süresi geçtiğinde ve hesabın
    # hassas alanlarını anonimleştirmek istediğimizde delete_date göre işlem yapan bir cron kalıcı silme veyahut
    # alanları maskeleme yapabilir.
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    company_name = models.CharField(max_length=255)
    description = models.TextField()
    blocked = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    create_date = models.DateTimeField(auto_now_add=True)
    update_date = models.DateTimeField(auto_now=True)
    delete_date = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f'{self.user.username} - {self.company}'
