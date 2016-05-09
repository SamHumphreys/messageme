class WsController < WebsocketRails::BaseController

  before_action :fetch_user


  def get_id
    if @current_user.present?
      WebsocketRails[:user_id].trigger(:user, @current_user.id)
      messages
    end
  end

  def messages
    @messages = Messages.all 
  end

  def goodbye
  end


  private
  def fetch_user
    @current_user = User.find_by :id => session[:user_id] if session[:user_id].present?
    session[:user_id] = nil unless @current_user.present?
  end
end
