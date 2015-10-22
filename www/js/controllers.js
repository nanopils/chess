angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})


.controller('GamesListCtrl', function($rootScope, $scope, GameList) {
  var getList = $scope.refreshList = function () {
  var tournaments = $rootScope.chess.firebaseRef.child('tournaments');
  tournaments.on('value', function (snapshot) {
    console.log('Got data');
    console.log(snapshot.val());
  });
  GameList.all()
    .success(function(data, status, headers, config) {
      $scope.games = data;
    })
    .error(function(data, status, headers, config) {
      console.log('En feil (' + status + ') oppsto mens appen hentet målerlisten.');
    })
    .finally(function () {
        // Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
      });
  };

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  $scope.$on('$ionicView.enter', function(e) {
    getList();
  });

  getList();

})

.controller('GameCtrl', function($scope, $stateParams, GameList, ChessBoard) {
  $scope.getGame = function () {
    GameList.get($stateParams.gameId)
    .success(function(data, status, headers, config) {
      scrollTo(0,0);
      $scope.game = data;
      ChessBoard.init($scope.game);
    })
    .error(function(data, status, headers, config) {
      console.log('En feil (' + status + ') oppsto mens appen hentet målerdata.');
    })
    .finally(function () {
        // Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
      });
  };

  $scope.updateGame = function (gameValue) {
    var gameValue = gameValue.replace(',', '.');
    if (isNaN(parseFloat(gameValue)) === false) {
      var updateObj = {
        "$set": {
          "readyForShutDown": false
        },
        "$push": {
          "readings": {
            "value": gameValue
          }
        }
      };
      GameList.update($stateParams.gameId, updateObj)
      .success(function(data, status, headers, config) {
        $scope.getGame();
      })
      .error(function(data, status, headers, config) {
        console.log('En feil (' + status + ') oppsto med oppdatering av måleren.');
      });
    } else {
      console.log('Kun nummer er tillatt.');
    }
  };

  $scope.onInputChange = function (gameValue) {
    var gameValue = gameValue.replace(',', '.');
    if (isNaN(parseFloat(gameValue))) {
      console.log('Kun nummer er tillatt.');
    }
  };

  $scope.addComment = function (comment) {

  };

  $scope.getLastReading = function (game) {
    if (typeof(game) !== 'undefined') {
      var lastReading = game.readings[game.readings.length - 1];
      var value = lastReading.value;
      return (typeof(value) === 'undefined') ? 'ingen verdi' : value;
    } else {
      return 'ingen verdi'
    }
  };

  $scope.getGame();
})


.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
