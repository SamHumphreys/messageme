class WsController < WebsocketRails::BaseController

  before_action :fetch_user

  def inital_transmit
    if @current_user.present?
      WebsocketRails.users[@current_user.id] = connection
      WebsocketRails.users[@current_user.id].send_message('user_id', @current_user.id)
      WebsocketRails[:user_id].trigger(:user, @current_user.id)
      get_all_messages(@current_user)
      get_all_users(@current_user)
    end
  end

  def get_all_messages(user)
    messages = Message.all
    user_messages = []
    messages.each do |msg|
      if msg.user_id == user.id || msg.target == user.id
        user_messages << msg
      end
    end
    WebsocketRails.users[user.id].send_message('messages', user_messages)
  end

  def get_all_users(user)
    all_users = User.all
    other_users = []
    all_users.each do |u|
      if u.id != user.id
        new_user = {id: u.id,
                    name: u.first + ' ' + u.last[0],
                    image: u.image}
        other_users << new_user
      end
    end
    WebsocketRails.users[user.id].send_message('users', other_users)
  end

  def create_message
    @new_msg = Message.create message
    if @new_msg.save
      sender = @new_msg.user_id.to_s
      receiver = @new_msg.target.to_s
      WebsocketRails[sender].trigger(:msg_update, @new_msg)
      WebsocketRails[receiver].trigger(:msg_update, @new_msg)
    end
  end

  def goodbye
  end


  private
  def fetch_user
    @current_user = User.find_by :id => session[:user_id] if session[:user_id].present?
    session[:user_id] = nil unless @current_user.present?
  end
end
