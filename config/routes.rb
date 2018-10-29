Rails.application.routes.draw do
  devise_for :users
  root 'main#index'
  get 'editor', to: 'game_editor#index', as: 'editor'
  get 'editor/new', to: 'game_editor#new', as: 'new_game'
  post 'editor', to: 'game_editor#create'
  post 'editor/save', to: 'game_editor#save'
  get 'editor/:id', to: 'game_editor#edit', as: 'edit_game'
  post 'editor/load-assets', to: 'game_editor#load_assets'
  get 'game-assets/:name', to: 'game_editor#serve_asset'
end
