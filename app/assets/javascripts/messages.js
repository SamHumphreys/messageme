var constants = {
  userID: 0,
  connection: '',
  chatFocus: 0
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
      var $chatHead = $('<div/>').addClass('chat-head').attr('data', user.id);
      var $chatInner = $('<p/>').addClass('chat-inner').appendTo($chatHead);
      var $chatImg = $('<img>').attr({src: user.image,
                                      class: 'chat-img'
                                    }).appendTo($chatInner);
      var $chatName = $('<p/>').text(user.name).addClass('chat-name').appendTo($chatInner);
      $('.contacts').append($chatHead);
      addChatHeadListener(this);
    });
  });

  var addChatHeadListener = function (data) {
    console.log(data);
  };

});
