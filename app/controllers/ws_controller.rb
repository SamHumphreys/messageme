class WsController < WebsocketRails::BaseController

  before_action :fetch_user

  def get_id
    if @current_user.present?
      WebsocketRails[:user_id].trigger(:user, @current_user.id)
      WebsocketRails.users[@current_user.id] = connection
      messages(@current_user)
    end
  end

  def messages(user)
    messages = User.find(user.id).messages.uniq
    # send_message :messages, messages
    # binding.pry
    WebsocketRails.users[user.id].send_message('messages', messages)
  end

  def goodbye
  end


  private
  def fetch_user
    @current_user = User.find_by :id => session[:user_id] if session[:user_id].present?
    session[:user_id] = nil unless @current_user.present?
  end
end
