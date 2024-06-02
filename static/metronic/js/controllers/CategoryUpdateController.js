MetronicApp.controller('CategoryUpdateController', ['$rootScope', '$scope', 'settings', '$http', '$location', function ($rootScope, $scope, settings, $http, $location) {
    $scope.$on('$viewContentLoaded', function () {
        $scope.formData = {};
        var categoryId = $rootScope.$state.params.categoryId;
        console.log(categoryId);

        Metronic.initAjax();

        // Mevcut kategori bilgilerini getirme
        $http.get('/api/v1/category/' + categoryId)
            .then(function (response) {
                var category = response.data;
                $scope.formData.name = category.name;
                $scope.formData.description = category.description;
                $scope.formData.lease_disabled = category.lease_disabled;

                document.getElementById('name_input').value = category.name;
                document.getElementById('description_input').value = category.description;
            })
            .catch(function (error) {
                Swal.fire({
                    title: 'Hata!',
                    text: formatErrorMessage(error.data),
                    icon: 'error',
                    confirmButtonText: 'Tamam'
                });
            });

        $rootScope.submitForm = function () {
            var postData = {
                name: document.getElementById('name_input').value,
                description: document.getElementById('description_input').value,
            };

            $http.patch('/api/v1/category/' + categoryId + '/', postData, {
                headers: {
                    'X-CSRFToken': getCSRFToken()
                }
            })
                .then(function (response) {
                    Swal.fire({
                        title: 'Başarılı!',
                        text: 'Kategori başarıyla güncellendi.',
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

        // Kategori silme işlemi
        $scope.deleteCategory = function () {
            Swal.fire({
                title: 'Emin misiniz?',
                text: 'Bu kategoriyi silmek istediğinize emin misiniz?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Evet, sil',
                cancelButtonText: 'Hayır, iptal'
            }).then((result) => {
                if (result.isConfirmed) {
                    $http.delete('/api/v1/category/' + categoryId, {
                        headers: {
                            'X-CSRFToken': getCSRFToken()
                        }
                    })
                        .then(function (response) {
                            Swal.fire({
                                title: 'Başarılı!',
                                text: 'Kategori başarıyla silindi.',
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
                }
            });
        };

        document.getElementById('update_button').onclick = function (e) {
            e.preventDefault();
            $rootScope.submitForm();
        };

        document.getElementById('delete_button').onclick = function () {
            $scope.deleteCategory();
        };

        // set default layout mode
        $rootScope.settings.layout.pageSidebarClosed = false;
    });
}]);
