import logging

from django.db import models

from Core.clients.redis_client import RedisClient
from IHAKI.settings import env

redis_client = RedisClient()


class Configuration(models.Model):
    # Sistem işletimdeyken değişmesi gerekebilcek, deploy konfig olmayacak ayarları, örneğin kira iptalinde
    # minimum zaman veya site bilgileri gibi alanları configrationa tablosuna yazıyoruz. Ardından öncelikle redisten
    # olmak üzere sorguluyoruz.Redis boş ise dolduruyoruz. Hepsi prefixle başladığı anlık müdahaleler için redis
    # sunucuya bağlanmadan cache temizleme methodu verebiliriz.
    key = models.CharField(max_length=150, unique=True, null=False, blank=False, db_index=True)
    value = models.CharField(max_length=500)

    def save(self, *args, **kwargs):
        redis_client.set(env("REDIS_CONFIGURATION_PREFIX") + self.key, self.value, env("REDIS_CONFIGURATION_TTL"))
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


def clean_configration_cache(self, *args, **kwargs):
    try:

        # Find all keys with the prefix ABC_
        keys = redis_client.get('ABC_*')
        if not keys:
            self.stdout.write(self.style.SUCCESS('No keys found with prefix ABC_'))
            return

        # Delete the keys
        deleted_count = redis_client.delete(*keys)
        self.stdout.write(self.style.SUCCESS(f'Deleted {deleted_count} keys with prefix ABC_'))

    except Exception as e:
        logging.log("Error while ")

