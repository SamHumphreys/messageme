WebsocketRails::EventMap.describe do

  subscribe :login, 'ws#get_id'
  subscribe :client_disconnected, 'ws#goodbye'
  subscribe :connection_closed, 'ws#goodbye'



end
