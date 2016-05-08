class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :first
      t.string :last
      t.text :password_digest
      t.string :email
      t.boolean :admin
      t.text :image

      t.timestamps null: false
    end
  end
end
