from django.core.management.base import BaseCommand
import logging


class Command(BaseCommand):
    help = 'Delete all Redis keys with the prefix ABC_'

    def handle(self, *args, **kwargs):
        logging.basicConfig(level=logging.INFO)

        try:
            client = RedisClient()
            connection = client.get_connection()

            # Find all keys with the prefix ABC_
            keys = connection.keys('ABC_*')
            if not keys:
                self.stdout.write(self.style.SUCCESS('No keys found with prefix ABC_'))
                return

            # Delete the keys
            deleted_count = connection.delete(*keys)
            self.stdout.write(self.style.SUCCESS(f'Deleted {deleted_count} keys with prefix ABC_'))

        except Exception as e:
            logging.error("Failed to delete keys with prefix ABC_: %s", str(e))
            self.stdout.write(self.style.ERROR('Failed to delete keys with prefix ABC_'))
