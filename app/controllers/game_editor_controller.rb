class GameEditorController < ApplicationController
  def index
  end

  def load_assets
    current_user.games.first.assets.attach(params[:assets])
    respond_to do |format|
      format.js
    end
  end
end
