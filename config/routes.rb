Rails.application.routes.draw do
  devise_for :users
  root 'main#index', as: 'home'
  get 'editor', to: 'game_editor#index', as: 'editor'
  post 'editor/load_assets', to: 'game_editor#load_assets'
end
