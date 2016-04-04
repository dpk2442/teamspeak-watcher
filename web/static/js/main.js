(function () {
    'use strict';

    var channelsPromise = tw.ajax.get('channels'),
        clientsPromise = tw.ajax.get('clients'),
        currentClientsPromise = tw.ajax.get('data.current'),
        dailyUsagePromise = tw.ajax.get('data.daily_usage');

    channelsPromise.then(function(response) {
        var rootName = response.data[0]['channel_name'] + ' - TeamSpeak Watcher';
        document.title = rootName;
        document.getElementById('server-name').textContent = rootName;
    });

    Promise.all([channelsPromise, clientsPromise, currentClientsPromise]).then(function(vals) {
        var channels = vals[0].data,
            clients = vals[1].data,
            currentStatusTimestamp = tw.time.convertUTCTimestampToDate(vals[2].timestamp),
            currentClients = vals[2].data,
            clientsByChannel = {};

        document.getElementById('current-status-timestamp').textContent = 'Last Updated: ' +
            (currentStatusTimestamp.getMonth() + 1) + '/' + currentStatusTimestamp.getDate() + ' at ' +
            currentStatusTimestamp.getHours() + ':' + ('0' + currentStatusTimestamp.getMinutes()).slice(-2);
        
        for (var i in currentClients) {
            var client = currentClients[i];
            if (!(client['channel_id'] in clientsByChannel)) {
                clientsByChannel[client['channel_id']] = [];
            }
            clientsByChannel[client['channel_id']].push(clients[client['client_database_id']]);
        }
        for (var key in clientsByChannel) {
            clientsByChannel[key].sort(function(c1, c2) {
                return c1['client_nickname'].localeCompare(c2['client_nickname']);
            });
        }
        
        function getMarkupForChannel(channel) {
            var classname = 'channel';
            if (channel['_id'] === '0') {
                classname = 'server';
            }
            var markup = '<li class="' + classname + '">' + channel['channel_name'],
                clientsString = '',
                childChannelsString = '';
            if (channel['_id'] in clientsByChannel) {
                for (var i in clientsByChannel[channel['_id']]) {
                    var client = clientsByChannel[channel['_id']][i];
                    clientsString += '<li class="client">' + client['client_nickname'] + '</li>';
                }
            }
            for (var i in channel['children']) {
                var child = channels[channel['children'][i]];
                childChannelsString += getMarkupForChannel(child);
            }
            if (clientsString || childChannelsString) {
                markup += '<ul>' + clientsString + childChannelsString + '</ul>';
            }
            return markup + '</li>';
        }

        document.getElementById('server-display').innerHTML = getMarkupForChannel(channels[0]);
    });

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
