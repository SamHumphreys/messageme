class PagesController < ApplicationController

  def index
  end

  def messages
    if !@current_user.present?
      redirect_to root_path
    end
  end

end
