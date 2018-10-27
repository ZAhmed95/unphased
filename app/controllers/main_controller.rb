class MainController < ApplicationController
  # responsible for all non game editor related actions
  before_action :authenticate_user!
  def index
  end

  def test
    @game = current_user.games.first
    @game.assets.attach(params[:test_image])
    respond_to do |format|
      format.js { render inline: "alert('successfully uploaded image');" }
    end
  end
end
