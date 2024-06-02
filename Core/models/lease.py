from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from Core.models.customer import Customer
from Core.models.uav import UAV
from Core.clients.redis_client import RedisClient

redis_client = RedisClient()


class Lease(models.Model):
    ACTIVE = 'Active'
    CANCELLED = 'Cancelled'

    STATUS_CHOICES = [
        (ACTIVE, 'Active'),
        (CANCELLED, 'Cancelled'),
    ]

    lessor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    lessor_static = models.CharField(max_length=255, null=True, blank=True)
    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True, blank=True)
    customer_static = models.CharField(max_length=255, null=True, blank=True)
    uav = models.ForeignKey(UAV, on_delete=models.SET_NULL, null=True, blank=True)
    uav_static = models.CharField(max_length=255, null=True, blank=True)
    lease_start = models.DateTimeField()
    lease_end = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=ACTIVE)
    is_deleted = models.BooleanField(default=False)
    create_date = models.DateTimeField(auto_now_add=True)
    update_date = models.DateTimeField(auto_now=True)
    delete_date = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'lease'

    def __str__(self):
        return f'Lease by {self.lessor.username} to {self.customer.user.username} for {self.uav.name}'

    def save(self, *args, **kwargs):
        lock_key = f'UAV_LEASE_LOCK_{self.uav.id}'

        # Kiralama yaparken farklı kullanıcılar veya farklı podlardan istek gelip üst üste yazmasın diye
        # kira sürecini kilitliyorum. Aslında bu iş için hazelcast daha iyi bir çözüm olabilir ancak redisi
        # hazır implemente etmişken kullanıyorum. Bu case için oldukça yeterli.
        if redis_client.get(lock_key) == 1:
            raise ValidationError(
                'İHA şu an başka bir kullanıcı tarafından kiralanma sürecinde, lütfen daha sonra tekrar deneyin.')

        # İHA kilit altına değil, maksimumu 60 saniye olacak şekilde kilitliyorum. 60 saniyeden uzun sürmesi şuanki
        # mimaride pek mümkün durmuyor. Olduki keyini bir sebeple silemedi TTL öleceği için iha tekrar kiralanabilir
        # olacaktır.
        redis_client.set(lock_key, 1, 60)

        try:
            # Kullanıcı tarafından oluşturulan kayıtlar için
            if 'user' in kwargs:
                current_user = kwargs.pop('user')
            else:
                # Aksi durumda varsayılan sistemi kiralayan olarak atıyoruz.
                current_user = User.objects.get(id=1)

            # Statik birer kayıt oluşturarak user veya iha obje değişimlerine rağmen kira anındaki bilgilere ulaşma.
            if not self.pk:
                self.lessor = current_user
                self.lessor_static = current_user.username
                self.customer_static = self.customer.company_name if self.customer else ""
                self.uav_static = self.uav.name if self.uav else ""

            # Geçmiş zaman kontrolü.
            if self.lease_start < timezone.now():
                raise ValidationError('Kira başlangıç tarihi geçmişte olamaz.')

            # Seçili periyotta İHA kiralı mı kontrolü.
            overlapping_leases = Lease.objects.filter(
                uav=self.uav,
                status=self.ACTIVE,
                lease_start__lt=self.lease_end,
                lease_end__gt=self.lease_start
            ).exclude(pk=self.pk)

            if overlapping_leases.exists():
                raise ValidationError('İHA seçtiğiniz tarih aralığında kiralanmış durumda. Lütfen farklı bir tarih seçiniz.')

            super(Lease, self).save(*args, **kwargs)
        finally:
            # Kod tarafında oluşan exceptionlar genellikle ölümcül kilit oluşturuyor. Aslında 60 saniye gibi bir TTL
            # belirledim. Ancak yine de her tür exceptiona rağmen bu kod bloğu çalışacaktır.
            redis_client.delete(lock_key)
