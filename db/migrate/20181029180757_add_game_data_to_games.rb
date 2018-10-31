class AddGameDataToGames < ActiveRecord::Migration[5.2]
  def change
    add_column :games, :game_data, :json
  end
end
