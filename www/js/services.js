angular.module('starter.services', [])

.factory('GameList', function($http) {
  // Might use a resource here that returns a JSON array
  
  var baseUrl = 'http://mockem.duckdns.org:2355/api/meter';

  // var showToastMessage = function (message, duration, location) {
  //   duration = duration || 'short';
  //   location = location || 'bottom';
  //   try {
  //     $cordovaToast.show(message, duration, location).then(function(success) {
  //       console.log("The toast was shown");
  //     }, function (error) {
  //       console.log("The toast was not shown due to " + error);
  //     });
  //   } catch (error) {
  //     // ToDo: show message for web
  //   }
  // }

  return {
    all: function() {
      return $http.get(baseUrl);
    },
    // remove: function(game) {
    //   games.splice(games.indexOf(game), 1);
    // },
    get: function(gameId) {
      return $http.get(baseUrl + '/' + gameId);
      // for (var i = 0; i < games.length; i++) {
      //   if (games[i].id === parseInt(gameId)) {
      //     return games[i];
      //   }
      // }
      // return null;
    },
    update: function (gameId, updateData) {
      return $http.put(baseUrl + '/' + gameId, updateData);
    }
    // showToast: function (message, duration, location) {
    //   showToastMessage(message, duration, location);
    // }
  };
})
.factory('ChessBoard', function (chessboard, chess) {
  return {
    init: function (game) {
      // var board = ChessBoard('board', 'start');

    var board,
        game = new Chess(),
        statusEl = $('#status'),
        fenEl = $('#fen'),
        pgnEl = $('#pgn');

      // do not pick up pieces if the game is over
      // only pick up pieces for the side to move
      var onDragStart = function(source, piece, position, orientation) {
        if (game.game_over() === true ||
            (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
            (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
          return false;
        }
      };

      var onDrop = function(source, target) {
        // see if the move is legal
        var move = game.move({
          from: source,
          to: target,
          promotion: 'q' // NOTE: always promote to a queen for example simplicity
        });

        // illegal move
        if (move === null) return 'snapback';

        updateStatus();
      };

      // update the board position after the piece snap 
      // for castling, en passant, pawn promotion
      var onSnapEnd = function() {
        board.position(game.fen());
      };

      var updateStatus = function() {
        var status = '';

        var moveColor = 'White';
        if (game.turn() === 'b') {
          moveColor = 'Black';
        }

        // checkmate?
        if (game.in_checkmate() === true) {
          status = 'Game over, ' + moveColor + ' is in checkmate.';
        }

        // draw?
        else if (game.in_draw() === true) {
          status = 'Game over, drawn position';
        }

        // game still on
        else {
          status = moveColor + ' to move';

          // check?
          if (game.in_check() === true) {
            status += ', ' + moveColor + ' is in check';
          }
        }

        statusEl.html(status);
        fenEl.html(game.fen());
        pgnEl.html(game.pgn());
      };

      var cfg = {
        draggable: true,
        position: 'start',
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd
      };
      board = ChessBoard('board', cfg);

      updateStatus();
    }
  };
})

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});

var jQuery = angular.module('jQuery', []);
jQuery.factory('$', ['$window', function($window) {
  return $window.$; // assumes jQuery has already been loaded on the page
}]);

var chessboard = angular.module('chessboard', []);
chessboard.factory('chessboard', ['$window', function($window) {
  return $window.ChessBoard; // assumes chessboard has already been loaded on the page
}]);

var chess = angular.module('chess', []);
chess.factory('chess', ['$window', function($window) {
  return $window.Chess; // assumes chess has already been loaded on the page
}]);

var underscore = angular.module('underscore', []);
underscore.factory('_', ['$window', function($window) {
  return $window._; // assumes underscore has already been loaded on the page
}]);