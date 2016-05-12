WebsocketRails::EventMap.describe do

  subscribe :login, 'ws#inital_transmit'
  subscribe :client_disconnected, 'ws#goodbye'
  subscribe :connection_closed, 'ws#goodbye'
  subscribe :new_message, 'ws#create_message'
  subscribe :mark_as_read, 'ws#mark_as_read'

end
