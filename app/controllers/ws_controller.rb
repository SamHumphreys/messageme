class WsController < WebsocketRails::BaseController

  before_action :fetch_user

  def get_id
    if @current_user.present?
      WebsocketRails[:user_id].trigger(:user, @current_user.id)
      messages(@current_user.id)
    end
  end

  def messages(user_id)
    messages = User.find(user_id).messages.uniq
    WebsocketRails[:messages].trigger(:get_all_messages, messages)
  end

  def goodbye
  end


  private
  def fetch_user
    @current_user = User.find_by :id => session[:user_id] if session[:user_id].present?
    session[:user_id] = nil unless @current_user.present?
  end
end
