var msgVars = {
  userID: 0,
  connection: '',
  chatFocus: 0,
  messages: []
}

$(document).ready(function () {

  //creates a websocket connection
  var dispatcher = new WebSocketRails(window.location.host + '/websocket');
  dispatcher.on_open = function (data) {
    msgVars.connection = data.connection_id;
    dispatcher.trigger('login', 'I am logged in meow');
  };

  //gets own userID on page refresh
  var channel = dispatcher.subscribe('user_id');
  channel.bind('user', function(id){
    msgVars.userID = id;
  });

  //receives all messages on page reset
  dispatcher.bind('messages', function (messages) {
    msgVars.messages = _.sortBy(messages, 'id');
  });

  //gets all other users and creates a contacts list
  dispatcher.bind('users', function (users) {
    displayContacts(users);
  });
});

var displayContacts = function (users) {
  _.each(users, function (user) {
    var $chatHead = $('<div/>').addClass('chat-head').attr('data', user.id);
    var $chatInner = $('<p/>').addClass('chat-inner').appendTo($chatHead);
    var $chatImg = $('<img>').attr({src: user.image,
                                    class: 'chat-img'
                                  }).appendTo($chatInner);
    var $chatName = $('<p/>').text(user.name).addClass('chat-name').appendTo($chatInner);
    $('.contacts').append($chatHead);
  });
  clickListen.chatHeadListener();
};

var clickListen = {
  chatHeadListener: function () {
    $('.chat-head').on('click', function () {
      msgVars.chatFocus = Number($(this).attr('data'));
      filterMessages(msgVars.messages, msgVars.chatFocus);
    });
  }
};

//creates a list of messages to or from the clicked on chat head and passes the list on to displayMessages
var filterMessages = function (messages, convoPal) {
  var relevantMessages = _.filter(messages, function(msg) {
    return (msg.user_id === convoPal) || (msg.target === convoPal)
  });
  displayMessages(relevantMessages);
};

//works out whether the messages are incoming or outgoing and displays them on the messages-show div
var displayMessages = function (messages) {
    $('.messages-show').html('');
    _.each(messages, function (msg) {
      var $msgToShow = $('<div/>').html('<p>'+msg.content+'</p>');
      if (msg.user_id === msgVars.userID) {   //ie, is a sent message
        $msgToShow.addClass('msg-outgoing');
      } else {
        $msgToShow.addClass('msg-incoming');
      };
      $('.messages-show').append($msgToShow);
    });
};
