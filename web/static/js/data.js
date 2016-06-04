(function () {
    'use strict';

    var dailyUsagePromise = tw.ajax.get('data.daily_usage');

    dailyUsagePromise.then(function (dailyUsage) {
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
            chart = new Chart(ctx).Line({
                labels: labels,
                datasets: [{
                    data: data,
                    fillColor: 'rgba(0, 0, 0, 0.1)',
                    strokeColor: '#000000',
                    pointColor: '#000000'
                }]
            }, {
                pointHitDetectionRadius: 1
            });
    });
})();
