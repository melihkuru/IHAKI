var SettingsTable = function () {

    var initPickers = function () {
        //init date pickers
        $('.date-picker').datepicker({
            rtl: Metronic.isRTL(),
            autoclose: true
        });
    }

    var handleRecords = function () {
        var grid = new Datatable();

        grid.init({
            src: $("#datatable_ajax4"),
            onSuccess: function (grid) {
                // execute some code after table records loaded
            },
            onError: function (grid) {
                // execute some code on network or other general error
            },
            loadingMessage: 'Yükleniyor...',
            dataTable: {
                "searching": true,
                "lengthMenu": [
                    [10, 20, 50, 100, 150, -1],
                    [10, 20, 50, 100, 150, "All"]
                ],
                "pageLength": 10,
                "ajax": {
                    "url": "/api/v1/configuration/",
                    "contentType": 'application/json; charset=utf-8',
                    "type": "GET",
                    "dataSrc": ""
                },
                "columnDefs": [{
                    "defaultContent": "-",
                    "targets": "_all"
                }],
                "columns": [
                    {"data": "key", "title": "Anahtar"},
                    {"data": "value", "title": "Değer"},
                ]
            }
        });
    }

    return {
        init: function () {
            initPickers();
            handleRecords();
        }
    };
}();
