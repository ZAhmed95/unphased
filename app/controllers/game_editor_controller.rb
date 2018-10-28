class GameEditorController < ApplicationController
  def index
  end

  def new
  end

  def create
    @game = current_user.games.create(name: params[:game_name])
    if @game.valid?
      redirect_to editor_path
    else
      redirect_to new_game_path
    end
  end

  def edit
    @game = current_user.games.find_by_id(params[:id])
  end

  def load_assets
    # current_user.games.first.assets.attach(params[:assets])
    respond_to do |format|
      format.js
    end
  end
end
