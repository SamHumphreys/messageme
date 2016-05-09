var constants = {
  userID: 0
}


$(document).ready(function () {

  var dispatcher = new WebSocketRails(window.location.host + '/websocket');
  dispatcher.on_open = function (data) {
    console.log('Connection established', data);
    dispatcher.trigger('login', 'I am logged in meow');
  };

  var channel = dispatcher.subscribe('user_id');
  channel.bind('user', function(id){
    constants.userID = id;
  });

  var channel = dispatcher.subscribe('messages');
  channel.bind('get_all_messages', function(messages) {
    console.log(messages);
  });

});
