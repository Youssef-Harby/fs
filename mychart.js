google.charts.load('current', { 'packages': ['gauge'] });
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
    var data = google.visualization.arrayToDataTable([
        ['Label', 'Value'],
        ['Water Level', 0]
    ]);

    var options = {
        width: 200, height: 200,
        redFrom: 2500, redTo: 3000,
        yellowFrom: 2000, yellowTo: 2500,
        minorTicks: 5
    };

    var chart = new google.visualization.Gauge(document.getElementById('gauge_div'));

    chart.draw(data, options);

    // Update the gauge when the water level changes
    Cesium.knockout.getObservable(viewModel, 'waterLevel').subscribe(function (newValue) {
        data.setValue(0, 1, newValue);
        chart.draw(data, options);
    });
}