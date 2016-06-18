(function () {
    'use strict';

    var dailyUsagePromise = tw.ajax.get('data.daily_usage');

    dailyUsagePromise.then(function (dailyUsage) {
        //Adds x-axis time labels to daily use graph 
        var labels = [];
        for (var i = 0; i < 48; i++) {
            var hours = ('0' + Math.floor(i / 2)).slice(-2),
                minutes = ('0' + ((i % 2) * 30)).slice(-2);
            labels.push(hours + ':' + minutes);
        }

        var data = dailyUsage.data.slice(),
            timezoneOffset = new Date().getTimezoneOffset(),
            shiftFromLeft = timezoneOffset > 0,
            numElementsToShift = Math.abs(timezoneOffset / 30);
        if (shiftFromLeft) {
            var dataToShift = data.splice(0, numElementsToShift);
            Array.prototype.push.apply(data, dataToShift);
        } else {
            var dataToShift = data.splice(-numElementsToShift);
            Array.prototype.unshift.apply(data, dataToShift);
        }

        var ctx = document.getElementById('daily-usage-graph').getContext('2d'),
            chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    pointHitDetectionRadius: 1,
                    datasets: [{
                        data: data,
                        label: null,
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderColor: 'rgba(8, 145, 207, 1.0)',
                        pointBorderColor: 'rgba(255, 255, 255, 1.0)'
                    }]
                },
                options: {
                    legend: {
                        display: false
                    },
                    scales: {
                        xAxes: [{ticks: {fontColor: "#FFF"}, gridLines: {color: "rgba(0,0,0,0.5)"}}],
                        yAxes: [{ticks: {fontColor: "#FFF"}, gridLines: {color: "rgba(0,0,0,0.5)"}}]
                    }
                }
            });
    });
})();
