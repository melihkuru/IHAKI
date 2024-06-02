var UavTable = function () {

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
            src: $("#datatable_ajax2"),
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
                    "url": "/api/v1/uav/",
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
                        "render": function (data, type, row, meta) {
                            return '<a title="Düzenle" href="#/uav/' + data + '">' + data + '</a>';
                        }
                    },
                    {"data": "name", "title": "İsim"},
                    {"data": "codename", "title": "Kod Adı"},
                    {"data": "inventory_number", "title": "Envanter Numarası"},
                    {
                        "data": "create_date", "title": "Oluşturulma Tarihi",
                        "render": function (data) {
                            return moment(data).format("DD-MM-YYYY HH:mm");
                        }
                    },
                    {
                        "data": "update_date", "title": "Güncelleme Tarihi",
                        "render": function (data) {
                            return moment(data).format("DD-MM-YYYY HH:mm");
                        }
                    },
                    {
                        "data": "lease_disabled",
                        "title": "Kira Pasif",
                        "render": function (data) {
                            return data ? "Evet" : "Hayır";
                        }
                    },
                    {"data": "brand", "title": "Marka"},
                    {"data": "model", "title": "Model"},
                    {"data": "weight", "title": "Ağırlık"},
                    {"data": "takeoff_weight", "title": "Azami Kalkış Ağırlığı"},
                    {"data": "flight_range", "title": "Uçuş Menzili"},
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
