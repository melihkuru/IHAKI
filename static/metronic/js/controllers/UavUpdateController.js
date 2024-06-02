MetronicApp.controller('UavUpdateController', ['$rootScope', '$scope', 'settings', '$http', '$location', function ($rootScope, $scope, settings, $http, $location) {
    $scope.$on('$viewContentLoaded', function () {
        $.ajax({
            url: '/api/v1/category', // API endpoint'i
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                // Başarılı bir şekilde veri alındığında çalışacak fonksiyon
                var selectBox = $('#category'); // select kutusu
                selectBox.find('option').not(':first').remove(); // mevcut seçenekleri temizle
                $.each(data, function (index, category) {
                    // her kategori için bir seçenek oluştur
                    selectBox.append('<option value="' + category.id + '">' + category.name + '</option>');
                });
            },
            error: function (xhr, status, error) {
                console.error(error);
            }
        });
        $scope.formData = {};
        var uavId = $rootScope.$state.params.uavId;
        console.log(uavId);

        // initialize core components
        Metronic.initAjax();

        // Mevcut İHA bilgilerini getirme
        $http.get('/api/v1/uav/' + uavId)
            .then(function (response) {
                var uav = response.data;
                $scope.formData = {
                    name: uav.name,
                    code: uav.codename,
                    stock: uav.inventory_number,
                    brand: uav.brand,
                    model: uav.model,
                    weight: uav.weight,
                    takeoff_weight: uav.takeoff_weight,
                    flight_range: uav.flight_range,
                };

                var selectElement = document.getElementById('category');
                selectElement.value = uav.category;

            }).catch(function (error) {
            Swal.fire({
                title: 'Hata!',
                text: formatErrorMessage(error.data),
                icon: 'error',
                confirmButtonText: 'Tamam'
            });
        });

        // Form gönderme işlemi
        $rootScope.submitForm = function () {
            var postData = {
                category: $scope.formData.category,
                name: $scope.formData.name,
                codename: $scope.formData.code,
                inventory_number: $scope.formData.stock,
                brand: $scope.formData.brand,
                model: $scope.formData.model,
                weight: $scope.formData.weight,
                takeoff_weight: $scope.formData.takeoff_weight,
                flight_range: $scope.formData.flight_range,
            };

            $http.put('/api/v1/uav/' + uavId + '/', postData, {
                headers: {
                    'X-CSRFToken': getCSRFToken()
                }
            })
                .then(function (response) {
                    Swal.fire({
                        title: 'Başarılı!',
                        text: 'İHA başarıyla güncellendi.',
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

        // İHA silme işlemi
        $scope.deleteUav = function () {
            Swal.fire({
                title: 'Emin misiniz?',
                text: 'Bu İHA\'yı silmek istediğinize emin misiniz?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Evet, sil',
                cancelButtonText: 'Hayır, iptal'
            }).then((result) => {
                if (result.isConfirmed) {
                    $http.delete('/api/v1/uav/' + uavId, {
                        headers: {
                            'X-CSRFToken': getCSRFToken()
                        }
                    })
                        .then(function (response) {
                            Swal.fire({
                                title: 'Başarılı!',
                                text: 'İHA başarıyla silindi.',
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
                }
            });
        };

        // set default layout mode
        $rootScope.settings.layout.pageSidebarClosed = false;
    });
}]);
