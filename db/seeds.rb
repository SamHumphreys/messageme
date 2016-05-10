User.destroy_all

u1 = User.create :first => 'Sam', :last => 'Humphreys', :password => 'chicken', :email => 'sam@ga.co', :admin => true
u2 = User.create :first => 'Bill', :last => 'Murray', :password => 'chicken', :email => 'bill@ga.co', :image => 'fillmurray.com/300/300'
u3 = User.create :first => 'Charlie', :last => 'Sheen', :password => 'chicken', :email => 'charlie@ga.co'
u4 = User.create :first => 'Nick', :last => 'Cage', :password => 'chicken', :email => 'nick@ga.co', :image => 'placecage.com/c/300/300'

Message.destroy_all

m1 = Message.create :content => 'sam to bill'
m2 = Message.create :content => 'sam to nick'
m3 = Message.create :content => 'bill to nick'
m4 = Message.create :content => 'bill to sam'

u1.messages << m1 << m2 << m4
u2.messages << m1 << m3 << m4
u3.messages << m2 << m3
u4.messages << m3

m1.users << u1 << u2
m2.users << u1 << u4
m3.users << u2 << u4
m4.users << u2 << u1

m1.update :creator => u1.id
m2.update :creator => u1.id
m3.update :creator => u2.id
m4.update :creator => u2.id
