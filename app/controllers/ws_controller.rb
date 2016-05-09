class WsController < WebsocketRails::BaseController

  def hello
    user = User.first
    WebsocketRails[:pictures].trigger(:picture, user)
  end

  def goodbye
  end

end
