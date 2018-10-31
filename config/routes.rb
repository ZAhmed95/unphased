Rails.application.routes.draw do
  devise_for :users
  root 'main#index'
  get 'editor', to: 'game_editor#index', as: 'editor'
  get 'editor/new', to: 'game_editor#new', as: 'new_game'
  post 'editor', to: 'game_editor#create'
  post 'editor/:id/save', to: 'game_editor#save', as: 'save_game'
  get 'editor/:id/edit', to: 'game_editor#edit', as: 'edit_game'
  post 'editor/:id/load-assets', to: 'game_editor#load_assets', as: 'load_assets'

  get 'games/:id/play', to: 'game_editor#show', as: 'play_game'
  get 'games/:id/data', to: 'game_editor#data'

  get 'games/:id/game-assets/:name', to: 'game_editor#serve_asset'
  get 'editor/:id/game-assets/:name', to: 'game_editor#serve_asset'
end
