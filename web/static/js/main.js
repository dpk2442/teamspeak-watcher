(function () {
    'use strict';

    var channelsPromise = tw.ajax.get('channels');

    channelsPromise.then(function(response) {
        var channels = response.data,
            rootName = channels[0]['channel_name'];

        document.title = rootName + ' - TeamSpeak Watcher';
        Array.prototype.forEach.call(document.querySelectorAll('.server-name'), function (el) {
            el.textContent = rootName;
        });

        var channelsMarkup = tw.markup.channel(channels, 0, {
            'renderChannelName': function (channelName) {
                var navLink = document.createElement('a');
                navLink.href = '#';
                navLink.appendChild(document.createTextNode(channelName))
                return navLink;
            }
        });
        document.getElementById('server-nav').appendChild(channelsMarkup);
    });
})();
