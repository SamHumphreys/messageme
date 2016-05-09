class UsersController < ApplicationController
  # before_action :authorise, :only => [:index]
  # before_action :logged_in, :only => [:show, :edit, :update, :destroy]

  def new
    @user = User.new
  end

  def create

    if params[:user]['image'].present?
      req = Cloudinary::Uploader.upload(params[:user]['image'])
      @user = User.new(user_params)
      @user.udpate :image => req['url']
    else
      @user = User.new(user_params)
      @user.update :image => 'http://www.priorlakeassociation.org/wp-content/uploads/2011/06/blank-profile.png'
    end

    if @user.save
      session[:user_id] = @user.id
      redirect_to root_path
    else
      render :new
    end
  end

  def index
    @users = User.all.sort_by {|user| user.id}
  end

  def edit
    @user = @current_user
  end

  def update
    user = @current_user
    user.update user_params
    if params[:user]["image"].present?
      req = Cloudinary::Uploader.upload(params[:user]["image"])
      user.update(:image => req["url"])
    end
    redirect_to user_path
  end

  def show
    @user = User.find params[:id]
    if @user.last.present?
      @initial = @user.last[0]
    end
  end

  def destroy
    user = User.find params[:id]
    user.destroy
    redirect_to users_path
  end

  private
  def user_params
    params.require(:user).permit(:email, :password, :password_confirmation, :image, :first, :last)
  end

  def authorise
    redirect_to root_path unless (@current_user.present? && @current_user.admin?)
  end

  def logged_in
    redirect_to root_path unless @current_user.present?
  end

end
