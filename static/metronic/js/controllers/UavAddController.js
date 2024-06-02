MetronicApp.controller('UavAddController', ['$rootScope', '$scope', 'settings', '$http', '$location', function ($rootScope, $scope, settings, $http, $location) {
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
        // initialize core components
        Metronic.initAjax();

        $rootScope.submitForm = function () {
            var postData = {
                name: $scope.formData.name,
                codename: $scope.formData.code,
                inventory_number: $scope.formData.stock,
                brand: "BAYKAR",
                model: $scope.formData.model,
                weight: $scope.formData.weight,
                takeoff_weight: $scope.formData.takeoff_weight,
                flight_range: $scope.formData.flight_range,
                category: $scope.formData.category
            }

            $http.post('/api/v1/uav/', postData, {
                headers: {
                    'X-CSRFToken': getCSRFToken()
                }
            })
                .then(function (response) {
                    Swal.fire({
                        title: 'Başarılı!',
                        text: 'İHA başarıyla oluşturuldu.',
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

        // set default layout mode
        $rootScope.settings.layout.pageSidebarClosed = false;
    });
}]);
