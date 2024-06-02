MetronicApp.controller('LeaseUpdateController', ['$rootScope', '$scope', 'settings', '$http', '$location', function ($rootScope, $scope, settings, $http, $location) {
    $scope.$on('$viewContentLoaded', function () {
        $.ajax({
            url: '/api/v1/uav', // API endpoint'i
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                // Başarılı bir şekilde veri alındığında çalışacak fonksiyon
                var selectBox = $('#uav'); // select kutusu
                selectBox.find('option').not(':first').remove(); // mevcut seçenekleri temizle
                $.each(data, function (index, uav) {
                    // her kategori için bir seçenek oluştur
                    selectBox.append('<option value="' + uav.id + '">' + uav.codename + ' | ' + uav.name + '</option>');
                });
            },
            error: function (xhr, status, error) {
                console.error(error);
            }
        });
        $.ajax({
            url: '/api/v1/customer', // API endpoint'i
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                // Başarılı bir şekilde veri alındığında çalışacak fonksiyon
                var selectBox = $('#customer'); // select kutusu
                selectBox.find('option').not(':first').remove(); // mevcut seçenekleri temizle
                $.each(data, function (index, company) {
                    // her kategori için bir seçenek oluştur
                    selectBox.append('<option value="' + company.id + '">' + company.company_name + '</option>');
                });
            },
            error: function (xhr, status, error) {
                console.error(error);
            }
        });

        var leaseId = $rootScope.$state.params.leaseId; // Kiralama ID'si
        $scope.formData = {};

        Metronic.initAjax();

        // Mevcut kiralama bilgilerini getirme
        $http.get('/api/v1/lease/' + leaseId)
            .then(function (response) {
                var lease = response.data;

                document.getElementById('customer').value = lease.customer;
                document.getElementById('customer').disabled = true;
                document.getElementById('uav').value = lease.uav;
                document.getElementById('uav').disabled = true;
            })
            .catch(function (error) {
                Swal.fire({
                    title: 'Hata!',
                    text: formatErrorMessage(error.data),
                    icon: 'error',
                    confirmButtonText: 'Tamam'
                });
            });

        // Lease güncelleme fonksiyonu
        $rootScope.updateForm = function () {
            var leaseStartDate = document.querySelector('input[name="lease_start"]').value;
            var leaseStartTime = document.querySelector('input[name="lease_start_time"]').value;

            // Lease bitiş tarihi ve saati
            var leaseEndDate = document.querySelector('input[name="lease_end"]').value;
            var leaseEndTime = document.querySelector('input[name="lease_end_time"]').value;

            // Tarih ve saati birleştir, sonra ISO 8601 biçimine dönüştür
            var leaseStartDateTime = moment(leaseStartDate + 'T' + leaseStartTime).toISOString();
            var leaseEndDateTime = moment(leaseEndDate + 'T' + leaseEndTime).toISOString();

            // postData hazırla
            var postData = {
                lease_start: leaseStartDateTime,
                lease_end: leaseEndDateTime,
                customer: $scope.formData.customer,
                uav: $scope.formData.uav,
            };

            // Güncelleme isteği yap
            $http.put('/api/v1/lease/' + leaseId, postData, {
                headers: {
                    'X-CSRFToken': getCSRFToken()
                }
            })
                .then(function (response) {
                    Swal.fire({
                        title: 'Başarılı!',
                        text: 'Kiralama başarıyla güncellendi.',
                        icon: 'success',
                        confirmButtonText: 'Tamam'
                    }).then(() => {
                    });
                    $location.path('/uav/list');
                })
                .catch(function (error) {
                    Swal.fire({
                        title: 'Hata!',
                        text: formatErrorMessage(error.data),
                        icon: 'error',
                        confirmButtonText: 'Tamam'
                    });
                });
        };

        // Lease silme fonksiyonu
        $scope.deleteLease = function () {
            Swal.fire({
                title: 'Emin misiniz?',
                text: 'Bu kiralama kaydını silmek istediğinize emin misiniz?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Evet, sil',
                cancelButtonText: 'Hayır, iptal'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Silme isteği yap
                    $http.delete('/api/v1/lease/' + leaseId, {
                        headers: {
                            'X-CSRFToken': getCSRFToken()
                        }
                    })
                        .then(function (response) {
                            Swal.fire({
                                title: 'Başarılı!',
                                text: 'Kiralama başarıyla silindi.',
                                icon: 'success',
                                confirmButtonText: 'Tamam'
                            }).then(() => {
                            });
                            $location.path('/lease/list');
                        })
                        .catch(function (error) {
                            Swal.fire({
                                title: 'Hata!',
                                text: formatErrorMessage(error.data),
                                icon: 'error',
                                confirmButtonText: 'Tamam'
                            });
                        });
                }
            });
        };

        document.getElementById('update_button').onclick = function (e) {
            e.preventDefault();
            $rootScope.submitForm();
        };

        document.getElementById('delete_button').onclick = function () {
            $scope.deleteLease();
        };

        // set default layout mode
        $rootScope.settings.layout.pageSidebarClosed = false;
    });
}]);
