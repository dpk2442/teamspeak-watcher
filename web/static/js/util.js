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
            get: function(endpoint) {
                return ajax_get(endpoints[endpoint]);
            }
        },
        time: {
            convertUTCTimestampToDate: function(timestamp) {
                var date = new Date(0);
                date.setUTCSeconds(timestamp);
                return date;
            }
        }
    };
})();
