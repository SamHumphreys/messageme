class AddCreatorToMessages < ActiveRecord::Migration
  def change
    add_column :messages, :creator, :integer
  end
end
