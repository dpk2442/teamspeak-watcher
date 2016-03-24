(function () {
    'use strict';

    function ajax_get(url, callback) {
        var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState === XMLHttpRequest.DONE) {
                if (request.status === 200) {
                    callback(request.responseText);
                } else {
                    throw new Error('Error loading data from server.');
                }
            }
        };
        request.open('GET', url);
        request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        request.send();
    }

    window.tw = {
        ajax: {
            get_clients: function(callback) {
                ajax_get(endpoints.clients, callback);
            },
            get_channels: function(callback) {
                ajax_get(endpoints.channels, callback);
            },
            get_data: function(callback) {
                ajax_get(endpoints.data, callback);
            }
        }
    };
})();
