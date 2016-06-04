(function () {
    'use strict';

    function ajax_get(url) {
        return new Promise(function(resolve, reject) {
            var request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (request.readyState === XMLHttpRequest.DONE) {
                    if (request.status === 200) {
                        resolve(JSON.parse(request.responseText));
                    } else {
                        reject('Error loading data from server.');
                    }
                }
            };
            request.open('GET', url);
            request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            request.send();
        });
    }

    window.tw = {
        ajax: {
            get: (function () {
                var endpointCache = {};
                return function(endpoint) {
                    if (!(endpoint in endpointCache)) {
                        endpointCache[endpoint] = ajax_get(endpoints[endpoint]);
                    }
                    return endpointCache[endpoint];
                }
            })()
        },
        time: {
            convertUTCTimestampToDate: function(timestamp) {
                var date = new Date(0);
                date.setUTCSeconds(timestamp);
                return date;
            }
        },
        markup: {
            channel: function getChannelMarkup(channels, channelId, options) {
                var options = options || {},
                    channel = channels[channelId],
                    clientsByChannel = options['clientsByChannel'],
                    channelElement = document.createElement('li'),
                    renderChannelName = options['renderChannelName'] || function (channelName) {
                        return document.createTextNode(channelName);
                    };
                if (channel['_id'] === '0') {
                    channelElement.className = 'server';
                } else {
                    channelElement.className = 'channel';
                }

                channelElement.appendChild(renderChannelName(channel['channel_name']));

                var children = document.createElement('ul');
                if (clientsByChannel && channel['_id'] in clientsByChannel) {
                    clientsByChannel[channel['_id']].forEach(function(client) {
                        var clientElement = document.createElement('li');
                        clientElement.className = 'client';
                        clientElement.appendChild(document.createTextNode(client['client_nickname']));
                        children.appendChild(clientElement);
                    });
                }
                if ('children' in channel) {
                    channel['children'].forEach(function(childId) {
                        children.appendChild(getChannelMarkup(channels, childId, options));
                    });
                }

                if (children.childNodes.length > 0) {
                    channelElement.appendChild(children);
                }

                return channelElement;
            }
        }
    };
})();
