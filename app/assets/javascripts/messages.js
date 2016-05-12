var msgVars = {
  userID: 0,
  connection: '',
  chatFocus: 0,
  messages: [],
  unread: [],
  unreadCount: 0
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
    console.log('receives id', id);
    msgVars.userID = id;
  });

  //gets all other users and creates a contacts list
  dispatcher.bind('users', function (users) {
    console.log('get users', users);
    displayContacts(users);
    updateUnread();
  });

  //receives all messages on page reset
  dispatcher.bind('messages', function (messages) {
    console.log('recieved all messages', messages);
    msgVars.messages = _.sortBy(messages, 'id');
    _.each(messages, function (msg) {
      if (msg.seen !== true && msg.target === msgVars.userID) {
        msgVars.unreadCount ++;
        msgVars.unread.push(msg.user_id);
      };
    });
    msgVars.unread = _.uniq(msgVars.unread).sort();
    listenForMessages();
  });

  //listen to new messages sent to your user ID when the database updates
  var listenForMessages = function () {
    console.log('listenForMessages');
    var listen_channel = dispatcher.subscribe(msgVars.userID.toString());
    listen_channel.bind('msg_update', function (msg) {
      console.log('new message received', msg);

      console.log('**',msgVars.unreadCount, msgVars.unread);
      msgVars.messages.push(msg);
      if (msg.user_id !== msgVars.userID) {
        msgVars.unreadCount++;
        msgVars.unread.push(msg.user_id)
      };
      console.log('**',msgVars.unreadCount, msgVars.unread);

      if (msg.user_id === msgVars.chatFocus || msg.target === msgVars.chatFocus) {
        filterMessages(msgVars.messages, msgVars.chatFocus);
      } else {
        updateUnread();
      };
    });
  };

  //send a message to the database
  var sendMessage = function (message) {
    console.log('sendMessage', message);
    dispatcher.trigger('new_message', message);
  };

  //tells the server that a message has been rendered
  var markAsRead = function (msgID) {
    console.log('markAsRead');
    dispatcher.trigger('mark_as_read', msgID);
    if (msgVars.unreadCount > 0) {
      msgVars.unreadCount --;
    };
  };

  var updateUnread = function () {
    console.log('updateUnread');
    //update Message button to show unread messages
    var $msgButton = $('.messages');
    if(msgVars.unreadCount > 0) {
      $msgButton.val('Messages (' + msgVars.unreadCount + ')').css('background', 'red');
    } else {
      $msgButton.val('Messages').css('background', '#beeeef');
    };

    //update chat head to show if any unread
    _.each(msgVars.unread, function (userId) {
      var $toUpdate = $('.contacts').find("[data='" + userId + "']");
      $toUpdate.css('background', 'red');
      if (msgVars.chatFocus === 0) {
        $('.contacts').prepend($toUpdate);
      } else {
        $('.contacts > div:nth-child(1)').after($toUpdate);
      };
    });
  };


  var displayContacts = function (users) {
    console.log('displayContacts', users);
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



  //creates a list of messages to or from the clicked on chat head and passes the list on to displayMessages
  var filterMessages = function (messages, convoPal) {
    console.log('filterMessages', messages, convoPal);
    var relevantMessages = _.filter(messages, function(msg) {
      return (msg.user_id === convoPal) || (msg.target === convoPal)
    });
    displayMessages(relevantMessages);
  };

  //works out whether the messages are incoming or outgoing and displays them on the messages-show div
  var displayMessages = function (messages) {
    console.log('displayMessages', messages);
    $('.messages-show').html('');
    _.each(messages, function (msg) {
      if (msg.seen !== true && msg.target === msgVars.userID) {
        markAsRead(msg.id);
      };
      var $messageContent = $('<div/>').addClass('message-content');
      $('<p/>').addClass('msg-text').text(msg.content).appendTo($messageContent);
      if (msg.user_id === msgVars.userID) {   //ie, is a sent message
        $messageContent.addClass('msg-outgoing');
      } else {
        $messageContent.addClass('msg-incoming');
      };
      $('.messages-show').append($messageContent);
    });
    $('.messages-show').scrollTop($('.messages-show')[0].scrollHeight);
    updateUnread();
  };


  var clickListen = {
    chatHeadListener: function () {
      console.log('chatHeadListener');
      $('.chat-head').on('click', function () {
        msgVars.chatFocus = Number($(this).attr('data'));
        msgVars.unread = _.reject(msgVars.unread, function (unreadID) {
          return unreadID === msgVars.chatFocus;
        });
        $(this).prependTo($('.contacts'));
        $('.contacts').scrollTop(0);
        $('.chat-head').css('background', '#1f797a');
        $('#new-message').attr('disabled', false).focus();
        $(this).css('background', '#33c9cc');
        filterMessages(msgVars.messages, msgVars.chatFocus);
      });
    },
    sendMessageListener: function () {
      console.log('sendMessageListener');
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

});
