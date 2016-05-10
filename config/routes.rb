Rails.application.routes.draw do

  root :to => 'pages#index'

  get '/signup' => 'users#new'
  get '/login' => 'session#new'
  post '/login' => 'session#create'
  delete '/login' => 'session#destroy'
  get '/contacts' => 'pages#contacts'
  get '/messages' => 'pages#messages'

  resources :users

end
