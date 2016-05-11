$(document).ready(function () {

  if ($('.messages-content').length > 0) {
    resizeMessages();
  };

});

$(window).on('resize', function () {
  resizeMessages();
});

var resizeMessages = function () {
  var msgsHeight = window.innerHeight - 268;
  $('.messages-content').height(msgsHeight)
};
