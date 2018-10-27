class MainController < ApplicationController
  # responsible for all non game editor related actions
  before_action :authenticate_user!
  def index
  end

  def editor
  end
end
