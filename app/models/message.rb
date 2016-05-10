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
  belongs_to :user
end
