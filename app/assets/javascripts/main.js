var constants = {
  userID: 0,
  connection: ''
}


$(document).ready(function () {

  var dispatcher = new WebSocketRails(window.location.host + '/websocket');
  dispatcher.on_open = function (data) {
    constants.connection = data.connection_id;
    dispatcher.trigger('login', 'I am logged in meow');
  };

  var channel = dispatcher.subscribe('user_id');
  channel.bind('user', function(id){
    constants.userID = id;
    console.log(constants.userID);
  });

  dispatcher.bind('messages', function (messages) {
    _.each(messages, function (message) {
      console.log(message);
    });
  });

  dispatcher.bind('users', function (users) {
    _.each(users, function (user) {
      console.log(user);
    });
  });

});
