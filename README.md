# IHAKI

Temelde 3 farklı ekran var. AeroSuperAdmin django varsayılan admin ekranı, sistemciler model bazında müdahale yapmak için kullanılabilir.
AeroAdmin kiralama faaliyetini yapan operasyon ekibinin kullanacağı ekranlar.
AeroLease ise müşterilerin kendi kiralamalarını yapabileceği ekranlardır.

IHAKI, İHA-Kirala 'dan gelen projenin genel kod adıdır.
Hazır template kullanılmasına izin verildiği için Metronik kullanılmıştır.
Önbellek ve kilit mekanizması için Redis kullanılıyor.
Veritabanı için PostgreSQL kullanılıyor. Müşteri kayıt olma aşamasında transaction örneği var.
AeroAdmin dashboard ekranındaki istatistikler gerçek verilerdir. /v1/api/stats ile erişilebilir.
Önyüzde uygulamanın akışını Angular ile geliştirdim. Tüm istekler ajax ile sonuçlanıyor.
Giriş ve Kayıt ekranları ise standart form-post ile çalışıyor.

Bazı ekranlar:
![alt text](https://github.com/melihkuru/IHAKI/blob/master/Screenshoots/1.png?raw=true)





