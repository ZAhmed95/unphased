Rails.application.routes.draw do
  devise_for :users
  root 'main#index', as: 'login'
  get 'home', to: 'main#show', as: 'home'
  post '/test', to: 'main#test', as: 'test'
end
