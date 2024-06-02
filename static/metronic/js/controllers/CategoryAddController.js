MetronicApp.controller('CategoryAddController', ['$rootScope', '$scope', 'settings', '$http', '$location', function ($rootScope, $scope, settings, $http, $location) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        Metronic.initAjax();

        $rootScope.submitForm = function () {
            // Form verilerini al
            var postData = {
                name: $scope.formData.name,
                description: $scope.formData.description,
                lease_disabled: $scope.formData.lease_disabled ?? 0,
            };

            $http.post('/api/v1/category/', postData, {
                headers: {
                    'X-CSRFToken': getCSRFToken()
                }
            })
                .then(function (response) {
                    Swal.fire({
                        title: 'Başarılı!',
                        text: 'Kategori başarıyla oluşturuldu.',
                        icon: 'success',
                        confirmButtonText: 'Tamam'
                    }).then(() => {
                    });
                    $location.path('/category/list');
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
