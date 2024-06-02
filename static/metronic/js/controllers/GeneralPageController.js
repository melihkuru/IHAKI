/* Setup general page controller */

MetronicApp.controller('GeneralPageController', ['$rootScope', '$scope', 'settings', function ($rootScope, $scope, settings) {
    $scope.$on('$viewContentLoaded', function () {
        var categoryId = $rootScope.$state.params.categoryId;
        console.log(categoryId)

        // initialize core components
        Metronic.initAjax();

        // set default layout mode
        $rootScope.settings.layout.pageSidebarClosed = false;
    });
}]);
