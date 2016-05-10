User.destroy_all

u1 = User.create :first => 'Sam', :last => 'Humphreys', :password => 'chicken', :email => 'sam@ga.co', :admin => true
u2 = User.create :first => 'Bill', :last => 'Murray', :password => 'chicken', :email => 'bill@ga.co', :image => 'fillmurray.com/300/300'
u3 = User.create :first => 'Charlie', :last => 'Sheen', :password => 'chicken', :email => 'charlie@ga.co'
u4 = User.create :first => 'Nick', :last => 'Cage', :password => 'chicken', :email => 'nick@ga.co', :image => 'placecage.com/c/300/300'

Message.destroy_all

m1 = Message.create :user_id => u1.id, :target => u2.id, :format => 'text', :seen => false, :content => 'sam to bill'
m2 = Message.create :user_id => u1.id, :target => u4.id, :format => 'text', :seen => false, :content => 'sam to nick'
m3 = Message.create :user_id => u2.id, :target => u4.id, :format => 'text', :seen => false, :content => 'bill to nick'
m4 = Message.create :user_id => u2.id, :target => u1.id, :format => 'text', :seen => false, :content => 'bill to sam'
