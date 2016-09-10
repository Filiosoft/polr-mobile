angular.module('starter.services', [])
    .factory('configService', ['$http', function ($http) {
        return {
            set: function (key, value) {
                return localStorage.setItem(key, JSON.stringify(value));
            },
            get: function (key) {
                return JSON.parse(localStorage.getItem(key));
            },
            destroy: function (key) {
                return localStorage.removeItem(key);
            },
        };
    }])

    .factory('polrService', ['$http', 'configService', function ($http, configService) {
        var apiUrl = configService.get('url');
        var apikey = configService.get('apikey');

        return {
            shorten: function (url, is_secret, custom_ending) {
                return $http.get(apiUrl + '/api/v2/action/shorten?key=' + apikey + '&url=' + url + '&custom_ending=' + custom_ending + '&is_secret=' + is_secret)
                    .then(function (res) {
                        console.log(res);
                    }).catch(function (err) {
                        console.error(err);
                    });
            },
            get: function (key) {
                return JSON.parse(localStorage.getItem(key));
            },
            destroy: function (key) {
                return localStorage.removeItem(key);
            },
        };
    }])