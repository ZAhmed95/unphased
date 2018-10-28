class MainController < ApplicationController
  # responsible for all non game editor related actions
  before_action :authenticate_user!
  def index
    if user_signed_in? then redirect_to editor_path end
  end
end
