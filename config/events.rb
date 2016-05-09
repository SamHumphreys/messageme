WebsocketRails::EventMap.describe do

  subscribe :hello, 'ws#hello'
  subscribe :client_disconnected, 'ws#goodbye'
  subscribe :connection_closed, 'ws#goodbye'


end
