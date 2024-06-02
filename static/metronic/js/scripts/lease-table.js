var LeaseTable = function () {
    var initFilters = function () {
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
    }

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
                    "url": "/api/v1/lease/",
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
                            return '<a title="Düzenle" href="#/lease/' + data + '">' + data + '</a>';
                        }
                    },
                    {"data": "customer_static", "title": "Kiralayan Firma"},
                    {"data": "uav_static", "title": "Kiralanan İHA"},
                    {
                        "data": "lease_start",
                        "title": "Kiralanma Başlangıç",
                        "render": function (data) {
                            return moment(data).format("DD-MM-YYYY HH:mm");
                        }
                    },
                    {
                        "data": "lease_end",
                        "title": "Kiralanma Bitiş",
                        "render": function (data) {
                            return moment(data).format("DD-MM-YYYY HH:mm");
                        }
                    },
                    {
                        "data": "create_date",
                        "title": "Kiralanma Tarihi",
                        "render": function (data) {
                            return moment(data).format("DD-MM-YYYY HH:mm");
                        }
                    },
                ]
            }
        });
    }

    return {
        init: function () {
            initPickers();
            handleRecords();
            initFilters();
        }
    };
}();
