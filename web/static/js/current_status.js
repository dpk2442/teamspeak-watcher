(function () {
    'use strict';

    var channelsPromise = tw.ajax.get('channels'),
        clientsPromise = tw.ajax.get('clients'),
        currentClientsPromise = tw.ajax.get('data.current');

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

        var channelsMarkup = tw.markup.channel(channels, 0, {'clientsByChannel': clientsByChannel});
        document.getElementById('server-display').appendChild(channelsMarkup);
    });
})();
