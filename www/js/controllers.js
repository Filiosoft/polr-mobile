angular.module('starter.controllers', [])

  .controller('AppCtrl', function ($scope, $ionicModal, $timeout, configService, $window) {
    $scope.loggedIn = false;
    var url = configService.get('url');
    var api = configService.get('apikey');

    if (url && api) {
      $scope.loggedIn = true;

      console.log("Logged in!")
    }
    else {
      $scope.loggedIn = false;
      console.log("Not logged in. ")
    }

    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
      $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
      console.log('Doing login', $scope.loginData);

      configService.set('url', $scope.loginData.url);
      configService.set('apikey', $scope.loginData.apikey);

      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function () {
        $scope.closeLogin();
        $window.location.reload(true)
      }, 1000);
    };

  })

  .controller('PlaylistsCtrl', function ($scope) {
    $scope.playlists = [
      { title: 'Reggae', id: 1 },
      { title: 'Chill', id: 2 },
      { title: 'Dubstep', id: 3 },
      { title: 'Indie', id: 4 },
      { title: 'Rap', id: 5 },
      { title: 'Cowbell', id: 6 }
    ];
  })

  .controller('LookupCtrl', function ($scope, $http, polrService, configService) {
    $scope.lookupComplete = false;
    $scope.url = {}
    $scope.url.url = configService.get('url');
    $scope.lookupResults = {}


    $scope.lookupUrl = function () {
      polrService.lookup($scope.url.custom_ending)
        .then(function (res) {
          $scope.lookupResults = res;
          $scope.lookupComplete = true;
          console.log(res);
        }).catch(function (err) {
          console.log(err);
        });
    }
  })

  .controller('ShortenCtrl', function ($scope, $window, configService, $state, polrService, $ionicModal) {
    $scope.url = {}
    $scope.url.url = configService.get('url');

    /* Beginning Modal */
    $ionicModal.fromTemplateUrl('templates/shortencomplete.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });
    $scope.closeModal = function () {
      $scope.modal.hide();
      $state.go('app.lookup', {}, { reload: true });
    };
    $scope.showModal = function () {
      $scope.modal.show();
    };
    /* End Modal */


    $scope.shorthenUrl = function () {
      if ($scope.url.secret == undefined) {
        $scope.url.secret = false;
      }

      if ($scope.url.shorten == undefined) {
        console.log("The URL is undefined.")
      }
      else {
        if ($scope.url.custom_ending == undefined) {
          polrService.shorten($scope.url.shorten, $scope.url.isSecret)
            .then(function (res) {
              $scope.showModal();
              console.log(res);
            }).catch(function (err) {
              console.log(err);
            });
        }
        else {
          polrService.shortenCustom($scope.url.shorten, $scope.url.isSecret, $scope.url.custom_ending)
            .then(function (res) {
              $scope.showModal();
              console.log(res);
            }).catch(function (err) {
              console.log(err);
            });
        }
      }
    }
  })

  .controller('SettingsCtrl', function ($scope, $window, configService, $state) {
    $scope.doLogout = function () {
      configService.destroy('apikey');
      configService.destroy('url');

      $window.location.reload(true);
      $state.go('app.urls', {}, { reload: true });
      console.log("Logged out.");
    }
  });
