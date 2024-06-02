var CustomerTable = function () {

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
            src: $("#datatable_ajax3"),
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
                    "url": "/api/v1/customer/",
                    "contentType": 'application/json; charset=utf-8',
                    "type": "GET",
                    "dataSrc": ""
                },
                "columnDefs": [{
                    "defaultContent": "-",
                    "targets": "_all"
                }],
                "columns": [
                    {
                        "data": "id",
                        "title": "ID",
                    },
                    {"data": "company_name", "title": "Firma İsmi"},
                    {
                        "data": "create_date",
                        "title": "Oluşturulma Tarihi",
                        "render": function (data) {
                            return moment(data).format("DD-MM-YYYY HH:mm");
                        }
                    },
                    {
                        "data": "update_date",
                        "title": "Güncelleme Tarihi",
                        "render": function (data) {
                            return moment(data).format("DD-MM-YYYY HH:mm");
                        }
                    },
                    {
                        "data": "blocked",
                        "title": "Blok",
                        "render": function (data) {
                            return data ? "Evet" : "Hayır";
                        }
                    }
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
