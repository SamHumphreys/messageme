class CreateMessages < ActiveRecord::Migration
  def change
    create_table :messages do |t|
      t.integer :user_id
      t.integer :target
      t.string :format
      t.text :content
      t.boolean :seen

      t.timestamps null: false
    end
  end
end
