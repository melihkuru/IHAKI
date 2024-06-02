import logging

from django.contrib.auth.models import User
from django.db import models

from Core.clients.redis_client import RedisClient
from IHAKI.settings import env

redis_client = RedisClient()


class Configuration(models.Model):
    # Sistem işletimdeyken değişmesi gerekebilcek, deploy konfig olmayacak ayarları, örneğin kira iptalinde
    # minimum zaman veya site bilgileri gibi alanları configration tablosuna yazıyoruz. Ardından öncelikle redisten
    # olmak üzere sorguluyoruz. Redis boş ise dolduruyoruz. Hepsi prefixle başladığı anlık müdahaleler için redis
    # sunucuya bağlanmadan cache temizleme methodunu ihaki_flush_cache komutu olarak ekledim.
    key = models.CharField(max_length=150, unique=True, null=False, blank=False, db_index=True)
    value = models.CharField(max_length=500)
    update_date = models.DateTimeField(auto_now=True)
    last_update_user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        db_table = 'configuration'

    def save(self, *args, **kwargs):
        redis_client.set(env("REDIS_CONFIGURATION_PREFIX") + self.key, self.value, env("REDIS_CONFIGURATION_TTL"))

        # Konfig bilgisini son güncelleyen kullanıcıyı tutmak faydalı olacaktır.
        user = kwargs.pop('user', None)
        if user and user.is_authenticated:
            self.last_update_user = user

        super().save(*args, **kwargs)

    @classmethod
    def get_key(cls, key, default=None):
        value = redis_client.get(env("REDIS_CONFIGURATION_PREFIX") + key)
        if value is not None:
            return value.decode('utf-8')

        try:
            config = cls.objects.get(key=key)
            redis_client.set(env("REDIS_CONFIGURATION_PREFIX") + key, value)
            return config.value
        except cls.DoesNotExist:
            return default
