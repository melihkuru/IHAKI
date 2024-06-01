from django.db import models
from django.contrib.auth.models import User

from Core.models.customer import Customer
from Core.models.uav import UAV


class Lease(models.Model):
    # Foreign key ilişkilerinde, ilişkili model değişebileceği için kiralama oluştuğu an statik bir kaydını alıyorum.
    # Bu sayede, isim değişimleri veya silinme olsa dahil kiralama anına ait veriler sağlıyor. Aslında daha doğru
    # bir şekilde İHA, Müşteri kayıtlarını düğüm olarak ele alıp her değişikliğe revizyon numarası verip eskileri
    # saklayarak kiralama anındaki revizyon numarasını kaydetmek olacaktı. Ancak bu proje özelinde zamanı göz önünde
    # bulundurup kompleksleştirmedim.
    ACTIVE = 'Active'
    CANCELLED = 'Cancelled'
    REQUESTED = 'Requested'
    TERMINATED = 'Terminated'

    STATUS_CHOICES = [
        (ACTIVE, 'Active'),
        (CANCELLED, 'Cancelled'),
        (REQUESTED, 'Request Edildi'),
        (TERMINATED, 'Iptal Edildi')
    ]

    lessor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    lessor_static = models.CharField(max_length=255)
    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True, blank=True)
    customer_static = models.CharField(max_length=255)
    uav = models.ForeignKey(UAV, on_delete=models.SET_NULL)
    uav_static = models.CharField(max_length=255)
    lease_start = models.DateTimeField()
    lease_end = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Active')
    is_deleted = models.BooleanField(default=False)
    create_date = models.DateTimeField(auto_now_add=True)
    update_date = models.DateTimeField(auto_now=True)
    delete_date = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f'Lease by {self.lessor.username} to {self.customer.user.username} for {self.uav.name}'
