#MESSAGEME

##Deployed to:
<http://howlatthemoon.herokuapp.com>

##Languages/techs Used:
Coded with:
* Ruby v 2.3.0
* Rails v 4.2.6
* JavaScript

Gems used:
* websocket-rails (note - dependency gem faye-websocket backdated to v 0.10.0)
* cloudinary
* bcrypt

##Summary:
MessageMe is a full stack messaging application completed as the final project for General Assembly's WDI course.

After using Ajax with continuous polling for the messaging function in Project2, I wanted to use websockets as a more elegant way of handling the get/post requests to the server.

##Models summary:
MessageMe uses two functional models, Users and Messages. Details can be seen in the db/schema.rb file.

##Code breakdown
The program flow can be summarised as:
###connection
messages.js - new Websocket connection is created, set as the var 'dispatcher'. This triggers the 'login' event. Binds to 'messages' and 'users' channels to receive information from the get_all_messages and get_all_users from the ws_controller.
It also subscribes to a channel which is the users id, so new messages sent to that user can be received.

When the 'users' channel is triggered it passes the array of users to the displayContacts function.

displayContacts - goes through each user and creates a chathead with a click listener on it. When you click on a chathead it brings that user to the top of the chathead list and displays the messages to and from that user.

When the 'messages' channel is triggered it passes the receives the array of messages and
>counts the unread messages
>creates a list of user ids which have unread messages
>calls the listenForMessages and listenForNewUsers functions.

events.rb -
login event calls the ws controller and inital_transmit function.

ws_controller.rb -
inital_transmit - sends the current user ID to the new user, as well as calling the get_all_messages and get_all_users functions.

get_all_messages - filters all of the messages to and from the user and sends them through as an array of objects to the 'messages' channel specific to the user.

get_all_users - sends the user id, first name,second initial, and image url of all other users to the user as an array of objects to the 'users' channel specific to the user.

##New User created
users_controller.rb -
when the @user.save is triggered as part of the users#create function the new user details are broadcast to the user_create channel sending the user id, first name and second initial, and image url as an object to all logged in users.

messages.js -
When the created_user trigger is pulled the object containing the user details is passed to the displayContacts to add the new user to the list of chatheads created on log in.

##Message sent
messages.js -
When a message is sent the following data is passed to the sendMessage function:
>user_id (the user sending the message)
>target (the message recipient)
>format (currently 'text')
>content (the message text)
>seen (set to false)

The sendMessage function triggers the 'new_message' event and passes the message details on to events.rb

events.rb -
On the new_message event the ws_controller is triggered with function 'create_message'

ws_controller.rb -
create_message is called passing the message object in. When the message is saved to the database it is broadcast to 2 channels, one for the sender and one for the receiver.

##New message received
messages.js -
The listenForMessages function is subscribed to a channel based on the users id. When the server broadcasts a new message (see Message Sent breakdown) to the user it will be checked to see if it is an incoming or outgoing message, and update the unread messages count or render it on the screen depending on the details.

##Mark message as read
messages.js -
All messages are created with the 'seen' tag set to false. Whenever a message is rendered in the browser it checks to see if the 'seen' status is false, and if it is the message id is passed to the markAsRead function.

This function triggers the 'mark_as_read' event and passes the message ID to events.rb.

It also reduces the number of unread messages by 1.

events.rb -
On the mark_as_read event the ws#mark_as_read function is called.

ws_controller.rb -
The mark_as_read function receives the message ID and updates that message to be :seen => true

Then going forward whenever the message is resent to the browser it will be sent with the seen tag as true and not be treated as an unread message.

##Future improvements:
There is a 'contacts' model which is not currently implemented. The app could be updated to allow users to manage their contacts, and set other users as favourites or block people from being able to message them.
