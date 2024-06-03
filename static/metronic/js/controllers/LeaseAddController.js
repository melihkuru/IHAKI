MetronicApp.controller('LeaseAddController', ['$rootScope', '$scope', 'settings', '$http', '$location', function ($rootScope, $scope, settings, $http, $location) {
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

        $scope.formData = {};
        // initialize core components
        Metronic.initAjax();

        $rootScope.submitForm = function () {
            var leaseStartDate = document.querySelector('input[name="lease_start"]').value;
            var leaseStartTime = document.querySelector('input[name="lease_start_time"]').value;

            // Lease end date and time
            var leaseEndDate = document.querySelector('input[name="lease_end"]').value;
            var leaseEndTime = document.querySelector('input[name="lease_end_time"]').value;

            // Combine date and time, then convert to ISO 8601 format
            var leaseStartDateTime = moment(leaseStartDate + 'T' + leaseStartTime).toISOString();
            var leaseEndDateTime = moment(leaseEndDate + 'T' + leaseEndTime).toISOString();

            // Prepare postData
            var postData = {
                lease_start: leaseStartDateTime,
                lease_end: leaseEndDateTime,
                customer: $scope.formData.customer,
                uav: $scope.formData.uav,
            };

            $http.post('/api/v1/lease/', postData, {
                headers: {
                    'X-CSRFToken': getCSRFToken()
                }
            })
                .then(function (response) {
                    Swal.fire({
                        title: 'Başarılı!',
                        text: 'Kiralama başarıyla oluşturuldu.',
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
        };

        // set default layout mode
        $rootScope.settings.layout.pageSidebarClosed = false;
    });
}]);
