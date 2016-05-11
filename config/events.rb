WebsocketRails::EventMap.describe do

  subscribe :login, 'ws#inital_transmit'
  subscribe :client_disconnected, 'ws#goodbye'
  subscribe :connection_closed, 'ws#goodbye'
  subscribe :new_message, 'ws#create_message'



end
