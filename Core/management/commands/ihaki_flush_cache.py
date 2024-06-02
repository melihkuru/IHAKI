from django.core.management.base import BaseCommand
from Core.clients.redis_client import RedisClient
from IHAKI.settings import env


# Özelleştirilmiş bir komut ile oluşturulan redis konfigrasyon önbellerini silme metodu yazdım.
# Kendi eklediğimiz komutlar için karışmaması için projenin prefixi olan ihaki ile başladım.
# Tabiki önbellek temizleme methodu admin panelde bir buton yapılabilirdi, konsept olarak bunu yapmak istedim.
class Command(BaseCommand):
    help = 'Delete all configuration redis keys.'

    def handle(self, *args, **kwargs):
        try:
            redis_client = RedisClient()
            prefix = env("REDIS_CONFIGURATION_PREFIX")
            keys = redis_client.get(f'{prefix}*')
            if not keys:
                self.stdout.write(self.style.WARNING(f'No keys found with prefix {prefix}'))
                return

            for key in keys:
                redis_client.delete(key)
            self.stdout.write(self.style.SUCCESS(f'Succesfully congifration cache cleaned.'))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Failed to delete keys with prefix ABC_: {str(e)}'))
