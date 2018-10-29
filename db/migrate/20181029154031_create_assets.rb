class CreateAssets < ActiveRecord::Migration[5.2]
  def change
    create_table :assets do |t|
      t.references :game
      t.text :name
      t.text :file_type
    end
  end
end
