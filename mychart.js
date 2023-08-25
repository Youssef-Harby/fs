google.charts.load('current', { 'packages': ['gauge'] });
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
    var data = google.visualization.arrayToDataTable([
        ['Label', 'Value'],
        ['Water Level', 0]
    ]);

    var options = {
        min: 0, max: 3000,
        width: 160, height: 160,
        redFrom: 600, redTo: 3000,
        yellowFrom: 400, yellowTo: 600,
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