# Relase 0.1.0
1. IHAKI-1 Pyhthon 3.9 Ve Django 4.2.13 İle Proje Oluşturdum.
2. IHAKI-2 PostgreSQL Client Kütüphanesini Dahil Ettim. Çevresel Değişkenler İçin Enviren Modülü Kullandım.
3. IHAKI-3 Sistemi AeroSuperAdmin:Sistem yöneticisin anında müdahaleler yapıp entryleri düzenleyebilceği bir panel AeroAdmin:Çalışanların kiralamaları ve uçakları yönetebileceği bir panel ve AeroLease:Müşterilerin kiralama yapıp mevcut uçaklarını kontrol edebileceği panel olmak üzere 3 domaine böldüm.
4. IHAKI-4 Tema olarak Metronik kullanmaya karar verdim. Bireysel bir proje için satın aldığım kopyası üzerinden temayı parçaladım. Static ve template dosyalarını hazırladım.
5. IHAKI-5 Ana sayfayı, login ekranlarını, login sistemini, login hatalarını kodladım. Grafikleri düzenledim.

# Relase 0.2.0
6. IHAKI-6 Kayıt şablonlarını oluşturdum. Fonkisyonlarını yazdım. Ayrıca login sonrası APP ekranlarında menü düzenlemeleri yaptım.
7. IHAKI-7 Yönetici panelinin ana sayfasını düzenledim. Taslakları oluşturdum. Hangi sayfaların olacağına karar verdim.
8. IHAKI-8 Müşteri, iha, kiralama, kategori gibi modelleri oluşturdum. Ayrıca içerde bir konfigrasyon sistemi kurdum. Redis üzerinden ön bellek çalışıyor.
9. IHAKI-9 Redis önbellek temizleme komutu oluşturdum. Varlıkların ilk migrationunu gerçekleştirdim.
10. IHAKI-10 Üye kayıt sistemi tamamlandı. Redis önbellek mekanizmasında eksikler giderildi. 

# Relase 0.3.0
11. IHAKI-11 Kategori, İHA, Kira ekleme ve listeleme form şablonlarını oluşturdum.
12. IHAKI-12 RESTFreamwok ile temel endpointleri oluşturdum. Bazı alanları hariç tutup (silindi gibi), yetkileri ayarladım.
12. IHAKI-13 Datatable, ajax ile ekleme sistemlerini tamamladım. Varlık düzenleme ve silme sistemi yaptım. Dashboard canlı istatistik getirdim.