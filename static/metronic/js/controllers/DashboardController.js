MetronicApp.controller('DashboardController', ['$rootScope', '$scope', 'settings', '$http', '$location', function ($rootScope, $scope, settings, $http, $location) {
    $scope.$on('$viewContentLoaded', function () {
        Metronic.initAjax();

        $http.get('/api/v1/stats/')
            .then(function (response) {
                var data = response.data;
                // Update HTML elements with data
                $('#totalUav').html(data.totalUav);
                $('#nowLeasedUav').html(data.nowLeasedUav);
                $('#totalCustomer').html(data.totalCustomer);
                $('#leaseRatio').html(data.leaseRatio + "%");
            })
            .catch(function (error) {
                console.error('Error fetching data:', error);
            });

        // set default layout mode
        $rootScope.settings.layout.pageSidebarClosed = false;
    });
}]);

