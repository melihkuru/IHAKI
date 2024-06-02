MetronicApp.controller('GeneralPageController', ['$rootScope', '$scope', 'settings', '$http', '$location', function ($rootScope, $scope, settings, $http, $location) {
    $scope.$on('$viewContentLoaded', function () {
        Metronic.initAjax();

        // set default layout mode
        $rootScope.settings.layout.pageSidebarClosed = false;
    });
}]);
