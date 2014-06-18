(function ($, Highcharts) {
    var Trends = {
            categories: {
                "Acción 1": "Depuración policial transparente",
                "Acción 2": "Polícias honestos bien remunerados",
                "Acción 3": "Mínimo 3 policías por cada 1,000 habitantes",
                "Acción 4": "Indicadores de delito verde",
                "Acción 5": "Ni un casino más",
                "Acción 6": "Ni un compadre incómodo más",
                "Acción 7": "Nuestras calles para las familias",
                "Acción 8": "Reforestación intensiva: 1 árbol por cada 3 habitantes",
                "Acción 9": "1 unidad deportiva por cada 50,000 habitantes",
                "Acción 10": "10 para un alcalde de 10"
            },
            columnsMapper: [
                "DepuracionPolicialTransparente",
                "PoliciasHonestosBienRemunerados",
                "3PoliciasPorCada1000Habitantes",
                "IndicadoresDelitoEnVerde",
                "PromedioSeguridad",
                "NiUnCasinoMas",
                "NiUnCompadreIncomodoMas",
                "PromedioTransparencia",
                "NuestrasCallesParaLasFamilias",
                "ReforestacionIntensiva",
                "1UnidadDeportiva",
                "PromedioEspaciosPublicos",
                "Reuniones"
            ],
            countyMapper: {
                "JUA": "Juárez",
                "MTY": "Monterrey",
                "SNG": "San Nicolás de los Garza",
                "STC": "Santa Catarina",
                "ESC": "Escobedo",
                "GAR": "García",
                "GDP": "Guadalupe",
                "APO": "Apodaca",
                "SPGG": "San Pedro Garza García"
            },
            mainGraphSeriesData: [],
            mainDrillDown: [],
            altSeriesData: [],
            resource_id: "6774c4a2-6c04-4d27-9b7d-3400b7f6725e",
            ckan_api: "http://datamx.io/api/action/datastore_search_sql?sql="
        },
        HighchartsSpanishOptions = {
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

    /*
     * Draw <select> options
     *
     * @function drawOptions
     * @param {Array} revisions - Array of revisions by Alcalde Como Vamos
     */
    function drawOptions(revisions) {
        var revisionOptions = "<select id=\"revision\">",
            $revisionSelector = $("#revision"),
            currentRevision;

        for (var i = 0, l = revisions.length; i < l; i++) {
            currentRevision = revisions[i].NumeroEvaluacion;

            revisionOptions += "<option value=\"" + currentRevision + "\">" + currentRevision + "</option>";
        }

        revisionOptions += "</select>";
        $revisionSelector.replaceWith(revisionOptions);
    }

    /**
     * Draw HighCharts' column object
     *
     * @function drawChart
     * @param {Number} revisionNumber - The number of the revision
     * @param {Array} mainSeriesData - Main series name and points
     * @param {Array} drillDownData - Array of drilldown points
     * @param {Array} altSeriesData - Alternative series name and points
     */
    function drawChart(revisionNumber, mainSeriesData, drillDownData, altSeriesData) {
        var mainChart,
            altChart,
            highChartsSetOptions;

        highChartsSetOptions = {
            title: {
                text: "¿Cómo vamos Nuevo León?"
            },
            subtitle: {
                text: "Revisión: " + revisionNumber
            },
            xAxis: {
                type: "category"
            },
            yAxis: {
                min: 0,
                title: {
                    text: "Puntaje en evaluación"
                }
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            credits: {
                enabled: true,
                href: "http://comovamosnl.org",
                text: "Alcalde, ¿Cómo Vamos?"
            }
        };

        mainChart = new Highcharts.Chart($.extend({}, highChartsSetOptions, {
            chart: {
                type: "column",
                renderTo: "main-graph"
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            tooltip: {
                formatter: function () {
                    // TODO: Please use Mustache or EJS
                    var pointName,
                        pointColor,
                        s = "<span style=\"font-size:11px\">";

                    s += this.series.name;
                    s += "</span><br />";

                    if (Trends.categories[this.point.name] !== undefined) {
                        pointName = Trends.categories[this.point.name];
                        pointColor = this.series.color;
                    } else {
                        pointName = this.point.name;
                        pointColor = this.point.color;
                    }

                    s += "<span style=\"color:" + pointColor + "\">" + pointName;
                    s += "</span>: <strong>" + this.point.y + "</strong><br />";

                    return s;
                },
                useHTML: true
            },
            series: [{
                name: "Municipios",
                colorByPoint: true,
                data: mainSeriesData
            }],
            drilldown: {
                series: drillDownData
            }
        }));

        altChart = new Highcharts.Chart($.extend({}, highChartsSetOptions, {
            chart: {
                type: "column",
                renderTo: "alt-graph"
            },
            xAxis: {
                categories: Object.keys(Trends.categories)
            },
            tooltip: {
                formatter: function () {
                    // TODO: Please use Mustache or EJS
                    var s = "<span style=\"font-size: 10px;font-weight:bold\">";
                    s += Trends.categories[this.points[0].key];
                    s += "</span><table>";

                    for (var i = 0, l = this.points.length; i < l; i++) {
                        s += "<tr><td style=\"color:";
                        s += this.points[i].series.color;
                        s += "; padding: 0\">";
                        s += this.points[i].series.name;
                        s += "</td><td style=\"padding:0\"><strong>";

                        if ($.isNumeric(this.points[i].y)) {
                            s += this.points[i].y;
                        } else {
                            s += "No disponible";
                        }

                        s += "</strong></td></tr>";
                    }

                    s += "</table>";

                    return s;
                },
                shared: true,
                useHTML: true
            },
            series: altSeriesData
        }));
    }

    /**
     * Create properly data for the Series
     *
     * @function createSeriesData
     * @param {Array} sourceData - Data from CKAN backend
     */
    function createSeriesData(sourceData) {
        var county,
            altCountyData,
            drillDownCountyData,
            accum,
            counter,
            value;

        Trends.altSeriesData = [];
        Trends.mainGraphSeriesData = [];
        Trends.mainDrillDown = [];

        for (var i = 0, l = sourceData.length; i < l; i++) {
            altCountyData = [];
            drillDownCountyData = [];
            accum = 0;
            counter = 0;
            county = Trends.countyMapper[sourceData[i].Municipio];

            for (var j = 1; j <= 10; j++) {
                value = parseInt(sourceData[i][Trends.columnsMapper[j - 1]], 10);

                // Main Graph data
                if ($.isNumeric(value)) {
                    accum = accum + value;
                    counter = counter + 1;
                }

                drillDownCountyData.push(["Acción " + j, value]);

                // Alternative Graph Data
                altCountyData.push(value);
            }

            // Main Graph Data
            Trends.mainGraphSeriesData.push({
                drilldown: county,
                name: county,
                y: Math.round(accum / counter)
            });

            Trends.mainDrillDown.push({
                id: county,
                name: county,
                data: drillDownCountyData
            });

            // Alternative Graph Data
            Trends.altSeriesData.push({
                name: county,
                data: altCountyData
            });
        }

        // Sort by DESC order
        Trends.mainGraphSeriesData.sort(function (a, b) {
            if (a.y > b.y) {
                return -1;
            }
            if (a.y < b.y) {
                return 1;
            }
            return 0;
        });
    }

    /**
     * Draw the container ID tag.
     *
     * @function drawContainer
     * @param {Number} revisionNumber - The number of the revision
     */
    function drawContainer(revisionNumber) {
        var errorMessage,
            url = Trends.ckan_api + "SELECT * FROM \"" + Trends.resource_id + "\" WHERE \"NumeroEvaluacion\"=" + revisionNumber;

        $.getJSON(url, function (data) {
            if (data.result.records.length > 0) {
                createSeriesData(data.result.records);
                drawChart(revisionNumber, Trends.mainGraphSeriesData,
                    Trends.mainDrillDown, Trends.altSeriesData);
            } else {
                errorMessage = "No hay datos disponibles para esta revisión.";
                $("#main-graph,#alt-graph").text(errorMessage);
            }
        });
    }

    // Listen for the jQuery ready event on the document
    $(function () {
        // Get the revisions
        var query = "SELECT DISTINCT(\"NumeroEvaluacion\") FROM \"" + Trends.resource_id + "\" ORDER BY \"NumeroEvaluacion\" DESC",
            url = Trends.ckan_api + query;

        $.getJSON(url, function (data) {
            drawOptions(data.result.records);

            drawContainer(data.result.records[0].NumeroEvaluacion);
        });

        // When somebody change the revision redraw the chart
        $("body").on("change", "#revision", function () {
            var targetRevision = parseInt($(this).val(), 10);

            drawContainer(targetRevision);
        });
    });
}(window.jQuery, window.Highcharts));
