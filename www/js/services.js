angular.module('app.services', [])
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
            }
        };
    }])

    .factory('polrService', ['$http', 'configService', function ($http, configService) {
        var apiUrl = configService.get('url');
        var apiVersion = 'v2';
        var apikey = configService.get('apikey');
        var baseUrl = apiUrl + '/api/' + apiVersion + '/action';

        return {
            shortenCustom: function (url, is_secret, custom_ending) {
                return $http.get(baseUrl + '/shorten?key=' + apikey + '&url=' + url + '&custom_ending=' + custom_ending + '&is_secret=' + is_secret)
                    .then(function (res) {
                        console.log(res);
                    }).catch(function (err) {
                        console.error(err);
                    });
            },
            shorten: function (url, is_secret) {
                return $http.get(baseUrl + '/shorten?key=' + apikey + '&url=' + url + '&is_secret=' + is_secret)
                    .then(function (res) {
                        console.log(res);
                    }).catch(function (err) {
                        console.error(err);
                    });
            },
            lookup: function (ending) {
                return $http.get(baseUrl + '/lookup?key=' + apikey + '&url_ending=' + ending)
                    .then(function (res) {
                        return res;
                    }).catch(function (err) {
                        return err;
                    });
            }
        };
    }])