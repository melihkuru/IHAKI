# IHAKI

IHAKI, İHA-Kirala projesinin genel kod adıdır. Projede temel olarak 3 farklı ekran bulunmaktadır:

1. **AeroSuperAdmin**: Django'nun varsayılan admin ekranıdır. Sistemciler, model bazında müdahale yapmak için bu ekranı
   kullanabilirler.

2. **AeroAdmin**: Kiralama faaliyetini yapan operasyon ekibinin kullanacağı ekranlardır.

3. **AeroLease**: Müşterilerin kendi kiralamalarını yapabileceği ekranlardır.

Proje için hazır bir template kullanılmasına izin verildiği için **Metronik** tercih edilmiştir. Önbellek ve kilit
mekanizması için **Redis** kullanılmaktadır. Veritabanı olarak **PostgreSQL**

Bazı ekranlar:

1. Karşılama Ekranı
   ![Genel Giriş ekranı](https://github.com/melihkuru/IHAKI/blob/main/Screenshoots/1.png?raw=true)
2. Django yönetim ekranı. Buraya bir geliştirme yapmadım. Yapıyı korudum.
   ![Genel Giriş ekranı](https://github.com/melihkuru/IHAKI/blob/main/Screenshoots/2.png?raw=true)
3. Kiralama Yöneticisi Giriş Ekranı
   ![Genel Giriş ekranı](https://github.com/melihkuru/IHAKI/blob/main/Screenshoots/3.png?raw=true)
4. Müşteri Giriş Ekranı
   ![Genel Giriş ekranı](https://github.com/melihkuru/IHAKI/blob/main/Screenshoots/4.png?raw=true)
5. Login sırasında kontroller ve hata mesajları.
   ![Genel Giriş ekranı](https://github.com/melihkuru/IHAKI/blob/main/Screenshoots/5.png?raw=true)
6. RESTFreamwork kök dizini. Login korumalı endpointler.
   ![Genel Giriş ekranı](https://github.com/melihkuru/IHAKI/blob/main/Screenshoots/6.png?raw=true)
7. Müşteri kayıt ekranı.
   ![Genel Giriş ekranı](https://github.com/melihkuru/IHAKI/blob/main/Screenshoots/7.png?raw=true)
8. Müşteri kayıt ekranı kontroller. Birden fazla hata durumunda toplu mesaj gösterimi. Server-side validasyonlar.
   ![Genel Giriş ekranı](https://github.com/melihkuru/IHAKI/blob/main/Screenshoots/8.png?raw=true)
9. Kiralama ekranı ana ekran. İstatistikler gerçek verilerden oluşmaktadır.
   ![Genel Giriş ekranı](https://github.com/melihkuru/IHAKI/blob/main/Screenshoots/9.png?raw=true)
10. Kategori ekleme ekranı. İptal formu temizliyor. Client-side validasyonlar da mevcut.
    ![Genel Giriş ekranı](https://github.com/melihkuru/IHAKI/blob/main/Screenshoots/10.png?raw=true)
11. Başarılı Ajax isteğinin ardından Swalalert ve liste yönlendirme.
    ![Genel Giriş ekranı](https://github.com/melihkuru/IHAKI/blob/main/Screenshoots/11.png?raw=true)
12. İHA listesi. AJAX cevap ile oluşan fakat filtrelemenin client-side yapıldığı bir datatable örneği.
    ![Genel Giriş ekranı](https://github.com/melihkuru/IHAKI/blob/main/Screenshoots/12.png?raw=true)
13. Varlık düzenleme ekranları, örnek kayıt silme uyarısı.
    ![Genel Giriş ekranı](https://github.com/melihkuru/IHAKI/blob/main/Screenshoots/13.png?raw=true)
14. İHA ekleme ekranları, foreign key ile bağlı nesnelerin selectbox seçimleri.
    ![Genel Giriş ekranı](https://github.com/melihkuru/IHAKI/blob/main/Screenshoots/14.png?raw=true)
15. İHA listeleri ve arama alanları.
    ![Genel Giriş ekranı](https://github.com/melihkuru/IHAKI/blob/main/Screenshoots/15.png?raw=true)
16. Kiralama ekranı. Kiralama sırasında server-side validasyonlar. Kiralama olumsuz ise bilgilendirme.
    ![Genel Giriş ekranı](https://github.com/melihkuru/IHAKI/blob/main/Screenshoots/16.png?raw=true)
17. Örnek bir kira ekleme ekranı.
    ![Genel Giriş ekranı](https://github.com/melihkuru/IHAKI/blob/main/Screenshoots/17.png?raw=true)
18. Müşteriler ekranı.
    ![Genel Giriş ekranı](https://github.com/melihkuru/IHAKI/blob/main/Screenshoots/18.png?raw=true)
19. Ayarlar ekranı. Ancak düzenleme mevcut değil.
    ![Genel Giriş ekranı](https://github.com/melihkuru/IHAKI/blob/main/Screenshoots/19.png?raw=true)
20. AeroLease müşteri kiralama ekranı. Normal şartlar altında kiralama listeleme iletişim gibi özellikler planlamıştım
    ancak bu kısım yetişmedi. Tüm odağımı AeroAdmin tarafına verdim. Ancak konsept olarak böyle olacaktı.
    ![Genel Giriş ekranı](https://github.com/melihkuru/IHAKI/blob/main/Screenshoots/20.png?raw=true)
21. Unit testler.
    ![Genel Giriş ekranı](https://github.com/melihkuru/IHAKI/blob/main/Screenshoots/21.png?raw=true)
22. Özel olarak eklediğim önbellek temizleme komutu.
    ![Genel Giriş ekranı](https://github.com/melihkuru/IHAKI/blob/main/Screenshoots/22.png?raw=true)
23. Veritabanı şemaları.
    ![Genel Giriş ekranı](https://github.com/melihkuru/IHAKI/blob/main/Screenshoots/23.png?raw=true)

**Proje Çalıştırma Bilgisi:**

Python 3.9 ile tercihen sanal ortam oluşturduktan sonra, .env.example dosyasını doldurdunuz. Ardından .env olarak
kaydediniz.

```bash
pip install --no-cache-dir -r requirements.txt  # manage.py dizininde gereksinimleri kurmak için.
python manage.py makemigrations  # muhtemelen versiyonlanmamış migration çıkmayacaktır.
python manage.py migrate  # ilk kurulum.
python manage.py createsuperuser  # kullanıcı oluşturma
python manage.py runserver  # sunucuyu başlatma
```

Müşteriler için django yönetim panelinden Müşteri ismiyle bir grup oluşturup .env dosyasına tanımlaması yapılabilir.
Henüz fonksiyonel olmadığı için zorunlu değildir. Grupsuz müşteri hesabı açacaktır.

**Son**

Yaklaşık 30 saatlik bir çalışmanın sonucudur.
Böyle bir sistemde kesinlikle dil desteği olmalıydı. Ancak zamanla beraber değerlendirdiğimde yetişemeyecceğimi anladım ve tüm mesajları Türkçe döndüm.
Teşekkürler.

Melih Kuru


