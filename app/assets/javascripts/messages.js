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
  dispatcher.bind('user_id', function (id) {
    msgVars.userID = id;
    listen_for_messages();
  });

  //send a message to the database
  var sendMessage = function (message) {
    dispatcher.trigger('new_message', message);
  };

  //listen to new messages sent to your user ID when the database updates
  var listen_for_messages = function () {
    var listen_channel = dispatcher.subscribe(msgVars.userID.toString());
    listen_channel.bind('msg_update', function (msg) {
      msgVars.messages.push(msg);
      if (msg.user_id === msgVars.chatFocus || msg.target === msgVars.chatFocus) {
        filterMessages(msgVars.messages, msgVars.chatFocus);
      };
    });
  };

  //receives all messages on page reset
  dispatcher.bind('messages', function (messages) {
    msgVars.messages = _.sortBy(messages, 'id');
  });

  //gets all other users and creates a contacts list
  dispatcher.bind('users', function (users) {
    displayContacts(users);
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
    clickListen.sendMessageListener();
  };

  var clickListen = {
    chatHeadListener: function () {
      $('.chat-head').on('click', function () {
        msgVars.chatFocus = Number($(this).attr('data'));
        filterMessages(msgVars.messages, msgVars.chatFocus);
      });
    },
    sendMessageListener: function () {
      $('.send-message').on('click', function () {
        var msgText = $('#new-message').val();
        if (msgVars.chatFocus !== 0 && msgText !== '') {
          var messageToSend = {
            user_id: msgVars.userID,
            target: msgVars.chatFocus,
            format: 'text',
            content: msgText,
            seen: false
          };
          sendMessage(messageToSend);
          $('#new-message').val('').focus();
        };
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
        var $messageContent = $('<p/>').addClass('message-content').text(msg.content);
        var $messageLine = $('<div/>').addClass('message-line').append($messageContent);
        if (msg.user_id === msgVars.userID) {   //ie, is a sent message
          $messageContent.addClass('msg-outgoing');
        } else {
          $messageContent.addClass('msg-incoming');
        };
        $('.messages-show').append($messageLine);
      });
      $('.messages-show').scrollTop($('.messages-show')[0].scrollHeight);
  };

});
