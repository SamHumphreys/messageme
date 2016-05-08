# == Schema Information
#
# Table name: messages
#
#  id         :integer          not null, primary key
#  type       :string
#  content    :text
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Message < ActiveRecord::Base
  has_and_belongs_to_many :users
end
