# models.py değil varlıkları ayrı dosyaladığım için burda tanımlamak zorunayım.
# Aksi halde makemigrations tanımıyor. Varlıkları models içinde tanımlayabilirdim ancak django Appleri
# varlık bazlı değil, domain bazlı ayırdığım için Core varlıkları, utilleri ve APIleri sunan temel yer olacak.
# Modellerin birbirleriyle karışmaması için bu yola gittim.
from .category import Category
from .configuration import Configuration
from .customer import Customer
from .lease import Lease
from .uav import UAV
