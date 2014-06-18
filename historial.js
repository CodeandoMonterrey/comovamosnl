(function ($, Highcharts) {
    var HighchartsSpanishOptions = {
        lang: {
            contextButtonTitle: "Menú de opciones",
            downloadJPEG: "Descarga imagen JPEG",
            downloadPNG: "Descarga imagen PNG",
            downloadSVG: "Descarga imagen SVG ",
            downloadPDF: "Descarga documento PDF",
            downloadCSV: "Descarga CSV",
            decimalPoint: ".",
            thousandsSep: ",",
            loading: "Cargando...",
            months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
            shortMonths: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
            weekdays: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sabado"],
            printChart: "Imprimir gráfico",
            rangeSelectorFrom: "Desde",
            rangeSelectorTo: "Hasta",
            rangeSelectorZoom: "Acercar",
            resetZoom: "Alejar"
        }
    };

    Highcharts.setOptions(HighchartsSpanishOptions);

    function createChart(pattern) {
        var sourceData = {},
            countyName,
            seriesData = [],
            resource_id = "6774c4a2-6c04-4d27-9b7d-3400b7f6725e",
            ckan_api = "http://datamx.io/api/action/datastore_search_sql?sql=",
            sql = "SELECT \"Municipio\",\"" + pattern + "\"  FROM \"" + resource_id + "\" ORDER BY \"NumeroEvaluacion\" ASC";

        $.getJSON(ckan_api + sql, function (data) {

            for (var i = 0, l = data.result.records.length; i < l; i++) {
                countyName = data.result.records[i].Municipio;
                if (sourceData[countyName] === undefined) {
                    sourceData[countyName] = [];
                }
                sourceData[countyName].push(parseInt(data.result.records[i][pattern], 10));
            }

            for (var county in sourceData) {
                if (sourceData.hasOwnProperty(county)) {
                    seriesData.push({
                        name: county,
                        data: sourceData[county]
                    });
                }
            }

            $("#container").highcharts({
                chart: {
                    zoomType: "x",
                    type: "spline"
                },
                title: {
                    text: "¿Cómo vamos Nuevo León?"
                },
                subtitle: {
                    text: document.ontouchstart === undefined ?
                        "Clic y arrastre en el área para hacer zoom in" : "Toque la pantalla para hacer zoom in"
                },
                xAxis: {
                    type: "datetime",
                    minRange: 60 * 24 * 3600000 // 60 days
                },
                yAxis: {
                    title: {
                        text: "Evaluación"
                    }
                },
                legend: {
                    enabled: true
                },
                plotOptions: {
                    spline: {
                        pointInterval: 60 * 24 * 3600 * 1000, // 60 days
                        pointStart: Date.UTC(2013, 2, 25)
                    }
                },
                series: seriesData
            });
        });
    }

    // Listen for the jQuery ready event on the document
    $(function () {

        createChart("DepuracionPolicialTransparente");

        // When somebody change the revision redraw the chart
        $("body").on("change", "#revision", function () {
            var targetRevision = $(this).val();

            createChart(targetRevision);
        });

    });
}(window.jQuery, window.Highcharts));
