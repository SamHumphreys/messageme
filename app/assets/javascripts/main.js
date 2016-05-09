$(document).ready(function () {

  var dispatcher = new WebSocketRails(window.location.host + '/websocket');

  dispatcher.on_open = function (data) {
    console.log('Connection established', data);
    dispatcher.trigger('hello', 'hi there!');
  };

  var channel = dispatcher.subscribe('pictures');
  channel.bind('picture', function(image){
    console.log(image);
    // var $piccy = $('<img>').attr('src', image)
    // console.log($piccy);
    // $('body').append($piccy);
  });

});
