# == Schema Information
#
# Table name: users
#
#  id              :integer          not null, primary key
#  first           :string
#  last            :string
#  password_digest :text
#  email           :string
#  admin           :boolean
#  image           :text
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

class User < ActiveRecord::Base
  has_secure_password
  validates :email, :presence => true, :uniqueness => true

  has_many :messages, :dependent => :destroy
  has_many :contacts
end
