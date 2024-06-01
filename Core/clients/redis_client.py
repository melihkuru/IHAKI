import os
import redis
import logging

from redis.sentinel import Sentinel


def get_redis_addresses(addresses):
    if not addresses:
        logging.error("No redis addresses found!")
        return None
    sentinel_addresses = []
    for address in addresses:
        host_port_pair = address.split(":")
        port = 6379 if len(host_port_pair) != 2 else int(host_port_pair[1])
        sentinel_addresses.append((host_port_pair[0], port))
    return sentinel_addresses


class RedisClient:
    # Bu redis client sentinel yapısını ve master discover desteklemtedir. Ayrıca master düştüğü zaman slave otomatik
    # turnover yapacaktır. Sınıflar bu redis client'ı üzerinden işlemlerini yapabilir.
    def __init__(self):
        self.redis_pool = None
        self.master_host = None
        self.master_port = None
        self.ADDRESSES = os.getenv("REDIS_ADDRESSES", "").split(",")
        self.REDIS_DB_INDEX = int(os.getenv("REDIS_DB_INDEX", 0))
        self.REDIS_PASSWORD = os.getenv("REDIS_PASSWORD", None)
        self.REDIS_MASTER = os.getenv("REDIS_MASTER", "mymaster")
        self.REDIS_TIMEOUT_SECONDS = int(os.getenv("REDIS_TIMEOUT_SECONDS", 5))
        self.REDIS_USE_SENTINEL = os.getenv("REDIS_USE_SENTINEL", "False").lower() == "true"

        if not self.ADDRESSES:
            logging.error("No sentinel addresses provided")
            raise ValueError("No sentinel addresses provided")

        self.initialize_pool()

    def initialize_pool(self):
        self.discover_master()
        logging.info("PID %d: initializing redis pool...", os.getpid())
        self.redis_pool = redis.ConnectionPool(
            host=self.master_host,
            port=self.master_port,
            db=self.REDIS_DB_INDEX,
            password=self.REDIS_PASSWORD,
            socket_timeout=self.REDIS_TIMEOUT_SECONDS
        )

    def discover_master(self):
        addresses = get_redis_addresses(self.SENTINEL_ADDRESSES)
        if not addresses:
            raise ValueError("Invalid sentinel addresses")

        # Eğer redisi sentinel modunda kullanmak istersek ayarı True yaparak birden fazla sentinel bilgisi verebiliriz.
        # Sentinel bağlanmamız gereken hostu "keşfet" yanıtı sonucu verecektir. Slave operasyonunu kendi yapacaktır.
        try:
            if self.REDIS_USE_SENTINEL:
                sentinel = Sentinel(addresses, socket_timeout=self.REDIS_TIMEOUT_SECONDS)
                self.master_host, self.master_port = sentinel.discover_master(self.REDIS_MASTER)
            else:
                address = addresses[0]
                self.master_host, self.master_port = address
        except Exception as err:
            logging.error("An error occurred when discovering master: %s", str(err))
            raise

    def get_connection(self):
        logging.info("Connecting to Redis server at %s:%d", self.master_host, self.master_port)
        try:
            return redis.StrictRedis(connection_pool=self.redis_pool)
        except Exception as err:
            logging.error("An error occurred when attempting to connect to Redis server: %s", str(err))
            raise

    def execute(self, _callback=None, *args):
        retry_count = 0
        max_retries = 3
        # Http isteklerinde retry yaparken genellikle ekspansiyonel timeout ekliyorum. Ancak kendi redis sunucumuza
        # bağlanamama durumunda akışta olan kodu da bekletmemek için ve cacheleme hayati bir görev olmadığı için anında
        # deneyip sonuç alamazsa redisten NULL dönecektir.
        while retry_count < max_retries:
            try:
                connection = self.get_connection()
                if _callback:
                    return getattr(connection, _callback)(*args)
                break
            except Exception as err:
                logging.error("An error occurred during Redis operation: %s", str(err))
                self.initialize_pool()
                retry_count += 1
        raise Exception("Max retries exceeded for Redis operation")

    def get(self, key):
        return self.execute("get", key)

    def set(self, key, value, ttl=0):
        return self.execute("set", key, value, ttl)

    def delete(self, key):
        return self.execute("del", key)
