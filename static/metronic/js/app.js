/***
 Metronic AngularJS App Main Script
 ***/

/* Metronic App */
var MetronicApp = angular.module("MetronicApp", [
    "ui.router",
    "ui.bootstrap",
    "oc.lazyLoad",
    "ngSanitize"
]);

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
MetronicApp.config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        // global configs go here
    });
}]);

/********************************************
 BEGIN: BREAKING CHANGE in AngularJS v1.3.x:
 *********************************************/
/**
 `$controller` will no longer look for controllers on `window`.
 The old behavior of looking on `window` for controllers was originally intended
 for use in examples, demos, and toy apps. We found that allowing global controller
 functions encouraged poor practices, so we resolved to disable this behavior by
 default.

 To migrate, register your controllers with modules rather than exposing them
 as globals:

 Before:

 ```javascript
 function MyController() {
  // ...
}
 ```

 After:

 ```javascript
 angular.module('myApp', []).controller('MyController', [function() {
  // ...
}]);

 Although it's not recommended, you can re-enable the old behavior like this:

 ```javascript
 angular.module('myModule').config(['$controllerProvider', function($controllerProvider) {
  // this option might be handy for migrating old apps, but please don't use it
  // in new ones!
  $controllerProvider.allowGlobals();
}]);
 **/

//AngularJS v1.3.x workaround for old style controller declarition in HTML
MetronicApp.config(['$controllerProvider', function ($controllerProvider) {
    // this option might be handy for migrating old apps, but please don't use it
    // in new ones!
    $controllerProvider.allowGlobals();
}]);

/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
 *********************************************/

/* Setup global settings */
MetronicApp.factory('settings', ['$rootScope', function ($rootScope) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        layoutImgPath: Metronic.getAssetsPath() + 'admin/layout/img/',
        layoutCssPath: Metronic.getAssetsPath() + 'admin/layout/css/'
    };

    $rootScope.settings = settings;

    return settings;
}]);

/* Setup App Main Controller */
MetronicApp.controller('AppController', ['$scope', '$rootScope', function ($scope, $rootScope) {
    $scope.$on('$viewContentLoaded', function () {
        Metronic.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 
    });
}]);

/***
 Layout Partials.
 By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial
 initialization can be disabled and Layout.init() should be called on page load complete as explained above.
 ***/

/* Setup Layout Part - Header */
MetronicApp.controller('HeaderController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initHeader(); // init header
    });
}]);

/* Setup Layout Part - Sidebar */
MetronicApp.controller('SidebarController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initSidebar(); // init sidebar
    });
}]);

/* Setup Layout Part - Theme Panel */
MetronicApp.controller('ThemePanelController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Footer */
MetronicApp.controller('FooterController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initFooter(); // init footer
    });
}]);

/* Setup Routing For All Pages */
MetronicApp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    // Redirect any unmatched url
    $urlRouterProvider.otherwise("/dashboard");

    $stateProvider

        // Dashboard
        .state('dashboard', {
            url: "/dashboard",
            templateUrl: "/static/metronic/views/dashboard.html",
            data: {pageTitle: 'İHA Kiralama Yönetim Paneli'},
            controller: "DashboardController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '/static/metronic/global/plugins/morris/morris.css',
                            '/static/metronic/admin/pages/css/tasks.css',

                            '/static/metronic/global/plugins/morris/morris.min.js',
                            '/static/metronic/global/plugins/morris/raphael-min.js',
                            '/static/metronic/global/plugins/jquery.sparkline.min.js',

                            '/static/metronic/admin/pages/scripts/index3.js',
                            '/static/metronic/admin/pages/scripts/tasks.js',

                            '/static/metronic/js/controllers/DashboardController.js'
                        ]
                    });
                }]
            }
        })


        // Category List
        .state('categoryList', {
            url: "/category/list",
            templateUrl: "/static/metronic/views/category/list.html",
            data: {pageTitle: 'İHA Kiralama Kategori Listesi'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '/static/metronic/global/plugins/select2/select2.css',
                            '/static/metronic/global/plugins/bootstrap-datepicker/css/datepicker.css',
                            '/static/metronic/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',

                            '/static/metronic/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                            '/static/metronic/global/plugins/select2/select2.min.js',
                            '/static/metronic/global/plugins/datatables/all.min.js',

                            '/static/metronic/global/scripts/datatable.js',
                            '/static/metronic/js/scripts/table-ajax.js',

                            '/static/metronic/js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })

        // Category Add
        .state('categoryAdd', {
            url: "/category/add",
            templateUrl: "/static/metronic/views/category/add.html",
            data: {pageTitle: 'İHA Kiralama Kategori Ekleme'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '/static/metronic/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            '/static/metronic/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                            '/static/metronic/global/plugins/jquery-tags-input/jquery.tagsinput.css',
                            '/static/metronic/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                            '/static/metronic/global/plugins/typeahead/typeahead.css',

                            '/static/metronic/global/plugins/fuelux/js/spinner.min.js',
                            '/static/metronic/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                            '/static/metronic/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                            '/static/metronic/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                            '/static/metronic/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                            '/static/metronic/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                            '/static/metronic/global/plugins/jquery-tags-input/jquery.tagsinput.min.js',
                            '/static/metronic/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                            '/static/metronic/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                            '/static/metronic/global/plugins/typeahead/handlebars.min.js',
                            '/static/metronic/global/plugins/typeahead/typeahead.bundle.min.js',
                            '/static/metronic/admin/pages/scripts/components-form-tools.js',

                            '/static/metronic/js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })

        // Kategori Düzenle (Sonda olması önemli list ve add akışı etkilenmesin)
        .state('category', {
            url: "/category/:categoryId",
            templateUrl: "/static/metronic/views/category/update.html",
            data: {pageTitle: 'İHA Kiralama Kategori Detay'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '/static/metronic/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            '/static/metronic/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                            '/static/metronic/global/plugins/jquery-tags-input/jquery.tagsinput.css',
                            '/static/metronic/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                            '/static/metronic/global/plugins/typeahead/typeahead.css',

                            '/static/metronic/global/plugins/fuelux/js/spinner.min.js',
                            '/static/metronic/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                            '/static/metronic/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                            '/static/metronic/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                            '/static/metronic/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                            '/static/metronic/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                            '/static/metronic/global/plugins/jquery-tags-input/jquery.tagsinput.min.js',
                            '/static/metronic/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                            '/static/metronic/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                            '/static/metronic/global/plugins/typeahead/handlebars.min.js',
                            '/static/metronic/global/plugins/typeahead/typeahead.bundle.min.js',
                            '/static/metronic/admin/pages/scripts/components-form-tools.js',

                            '/static/metronic/js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })


        // UAV List
        .state('uavList', {
            url: "/uav/list",
            templateUrl: "/static/metronic/views/uav/list.html",
            data: {pageTitle: 'İHA Listesi'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '/static/metronic/global/plugins/select2/select2.css',
                            '/static/metronic/global/plugins/bootstrap-datepicker/css/datepicker.css',
                            '/static/metronic/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',

                            '/static/metronic/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                            '/static/metronic/global/plugins/select2/select2.min.js',
                            '/static/metronic/global/plugins/datatables/all.min.js',

                            '/static/metronic/global/scripts/datatable.js',
                            '/static/metronic/js/scripts/table-ajax.js',

                            '/static/metronic/js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })

        // UAV Add
        .state('uavAdd', {
            url: "/uav/add",
            templateUrl: "/static/metronic/views/uav/add.html",
            data: {pageTitle: 'İHA Ekleme'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '/static/metronic/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            '/static/metronic/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                            '/static/metronic/global/plugins/jquery-tags-input/jquery.tagsinput.css',
                            '/static/metronic/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                            '/static/metronic/global/plugins/typeahead/typeahead.css',

                            '/static/metronic/global/plugins/fuelux/js/spinner.min.js',
                            '/static/metronic/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                            '/static/metronic/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                            '/static/metronic/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                            '/static/metronic/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                            '/static/metronic/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                            '/static/metronic/global/plugins/jquery-tags-input/jquery.tagsinput.min.js',
                            '/static/metronic/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                            '/static/metronic/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                            '/static/metronic/global/plugins/typeahead/handlebars.min.js',
                            '/static/metronic/global/plugins/typeahead/typeahead.bundle.min.js',
                            '/static/metronic/admin/pages/scripts/components-form-tools.js',

                            '/static/metronic/js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })

        // UAV Düzenle (Sonda olması önemli list ve add akışı etkilenmesin)
        .state('uav', {
            url: "/uav/:uavId",
            templateUrl: "/static/metronic/views/category/update.html",
            data: {pageTitle: 'İHA Detay'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '/static/metronic/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            '/static/metronic/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                            '/static/metronic/global/plugins/jquery-tags-input/jquery.tagsinput.css',
                            '/static/metronic/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                            '/static/metronic/global/plugins/typeahead/typeahead.css',

                            '/static/metronic/global/plugins/fuelux/js/spinner.min.js',
                            '/static/metronic/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                            '/static/metronic/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                            '/static/metronic/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                            '/static/metronic/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                            '/static/metronic/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                            '/static/metronic/global/plugins/jquery-tags-input/jquery.tagsinput.min.js',
                            '/static/metronic/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                            '/static/metronic/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                            '/static/metronic/global/plugins/typeahead/handlebars.min.js',
                            '/static/metronic/global/plugins/typeahead/typeahead.bundle.min.js',
                            '/static/metronic/admin/pages/scripts/components-form-tools.js',

                            '/static/metronic/js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })


        // Lease List
        .state('leaseList', {
            url: "/lease/list",
            templateUrl: "/static/metronic/views/lease/list.html",
            data: {pageTitle: 'İHA Kiralama Listesi'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '/static/metronic/global/plugins/select2/select2.css',
                            '/static/metronic/global/plugins/bootstrap-datepicker/css/datepicker.css',
                            '/static/metronic/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',

                            '/static/metronic/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                            '/static/metronic/global/plugins/select2/select2.min.js',
                            '/static/metronic/global/plugins/datatables/all.min.js',

                            '/static/metronic/global/scripts/datatable.js',
                            '/static/metronic/js/scripts/table-ajax.js',

                            '/static/metronic/js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })

        // Lease Cancel List
        .state('leaseCancellist', {
            url: "/lease/cancel/list",
            templateUrl: "/static/metronic/views/lease/cancel_request_list.html",
            data: {pageTitle: 'İHA Kiralama İptal Listesi'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '/static/metronic/global/plugins/select2/select2.css',
                            '/static/metronic/global/plugins/bootstrap-datepicker/css/datepicker.css',
                            '/static/metronic/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',

                            '/static/metronic/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                            '/static/metronic/global/plugins/select2/select2.min.js',
                            '/static/metronic/global/plugins/datatables/all.min.js',

                            '/static/metronic/global/scripts/datatable.js',
                            '/static/metronic/js/scripts/table-ajax.js',

                            '/static/metronic/js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })

        // Create Lease
        .state('leaseCreate', {
            url: "/lease/create",
            templateUrl: "/static/metronic/views/lease/add.html",
            data: {pageTitle: 'İHA Kiralama Oluştur'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '/static/metronic/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            '/static/metronic/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                            '/static/metronic/global/plugins/jquery-tags-input/jquery.tagsinput.css',
                            '/static/metronic/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                            '/static/metronic/global/plugins/typeahead/typeahead.css',

                            '/static/metronic/global/plugins/fuelux/js/spinner.min.js',
                            '/static/metronic/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                            '/static/metronic/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                            '/static/metronic/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                            '/static/metronic/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                            '/static/metronic/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                            '/static/metronic/global/plugins/jquery-tags-input/jquery.tagsinput.min.js',
                            '/static/metronic/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                            '/static/metronic/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                            '/static/metronic/global/plugins/typeahead/handlebars.min.js',
                            '/static/metronic/global/plugins/typeahead/typeahead.bundle.min.js',
                            '/static/metronic/admin/pages/scripts/components-form-tools.js',

                            '/static/metronic/js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })

        // Kategori Düzenle (Sonda olması önemli list ve add akışı etkilenmesin)
        .state('lease', {
            url: "/lease/:leaseId",
            templateUrl: "/static/metronic/views/lease/update.html",
            data: {pageTitle: 'İHA Kiralama Detay'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '/static/metronic/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            '/static/metronic/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                            '/static/metronic/global/plugins/jquery-tags-input/jquery.tagsinput.css',
                            '/static/metronic/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                            '/static/metronic/global/plugins/typeahead/typeahead.css',

                            '/static/metronic/global/plugins/fuelux/js/spinner.min.js',
                            '/static/metronic/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                            '/static/metronic/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                            '/static/metronic/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                            '/static/metronic/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                            '/static/metronic/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                            '/static/metronic/global/plugins/jquery-tags-input/jquery.tagsinput.min.js',
                            '/static/metronic/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                            '/static/metronic/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                            '/static/metronic/global/plugins/typeahead/handlebars.min.js',
                            '/static/metronic/global/plugins/typeahead/typeahead.bundle.min.js',
                            '/static/metronic/admin/pages/scripts/components-form-tools.js',

                            '/static/metronic/js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })

        // Category List
        .state('customerList', {
            url: "/customer/list",
            templateUrl: "/static/metronic/views/customer/list.html",
            data: {pageTitle: 'İHA Kiralama Müşteri Listesi'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '/static/metronic/global/plugins/select2/select2.css',
                            '/static/metronic/global/plugins/bootstrap-datepicker/css/datepicker.css',
                            '/static/metronic/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',

                            '/static/metronic/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                            '/static/metronic/global/plugins/select2/select2.min.js',
                            '/static/metronic/global/plugins/datatables/all.min.js',

                            '/static/metronic/global/scripts/datatable.js',
                            '/static/metronic/js/scripts/table-ajax.js',

                            '/static/metronic/js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })

        // Sistem ayarları
        .state('settings', {
            url: "/settings",
            templateUrl: "/static/metronic/views/settings/update.html",
            data: {pageTitle: 'İHA Kiralama Ayarlar'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '/static/metronic/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            '/static/metronic/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                            '/static/metronic/global/plugins/jquery-tags-input/jquery.tagsinput.css',
                            '/static/metronic/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                            '/static/metronic/global/plugins/typeahead/typeahead.css',

                            '/static/metronic/global/plugins/fuelux/js/spinner.min.js',
                            '/static/metronic/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                            '/static/metronic/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                            '/static/metronic/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                            '/static/metronic/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                            '/static/metronic/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                            '/static/metronic/global/plugins/jquery-tags-input/jquery.tagsinput.min.js',
                            '/static/metronic/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                            '/static/metronic/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                            '/static/metronic/global/plugins/typeahead/handlebars.min.js',
                            '/static/metronic/global/plugins/typeahead/typeahead.bundle.min.js',
                            '/static/metronic/admin/pages/scripts/components-form-tools.js',

                            '/static/metronic/js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })

}]);

/* Init global settings and run the app */
MetronicApp.run(["$rootScope", "settings", "$state", function ($rootScope, settings, $state) {
    $rootScope.$state = $state; // state to be accessed from view
}]);