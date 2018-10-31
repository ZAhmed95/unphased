class GameEditorController < ApplicationController
  
  def current_game
    helpers.current_game
  end

  def index
  end

  def new
  end

  def create
    @game = current_user.games.create(
      name: params[:game_name],
      game_data: {
        name: params[:game_name],
        config: {},
        assets: {},
        scenes: [], 
      }
    )
    if @game.valid?
      session[:game_id] = @game.id
      redirect_to editor_path
    else
      redirect_to new_game_path
    end
  end

  def edit
    @game = current_user.games.find_by_id(params[:id])
    session[:game_id] = @game.id;
  end

  def save
    @game = Game.find_by_id(params[:id])
    @game.update!(game_data: params[:game])
    render json: params.to_json
  end

  def show
    @game = Game.find_by_id(params[:id])
  end

  def data
    @game = Game.find_by_id(params[:id])
    p @game.game_data
    render json: @game.game_data
  end

  def load_assets
    @game = Game.find_by_id(params[:id])
    @data = params[:assets]
    messages = []
    unless @data
      message = {message: "No files uploaded.", type: "danger"}
      return render partial: 'load_assets', locals: {message: message}
    end

    unless @data.respond_to? :each
      @data = [@data]
    end

    @data.each do |file|
      if asset = @game.assets.find_by_name(file.original_filename)
        # the game already has this asset attached, update it
        if asset.update!(file: file)
          messages << {message: "Updated #{asset.name}", type: "success"}
        else
          messages << {message: "Failed to update #{asset.name}", type: "danger"}
        end
      else
        # this is a new asset
        # get the asset type from content_type
        content_type = file.content_type.split('/')
        # e.g. image, audio, etc.
        type = content_type[0]
        if type == 'application'
          # this is probably json
          type = content_type[1]
        end
        # create the asset
        asset = @game.assets.create!(
          name: file.original_filename,
          file_type: type,
          file: file,
        )
        if asset.valid?
          messages << {message: "Uploaded #{asset.name}", type: "success"}
        else
          messages << {message: "Failed to upload #{asset.name}", type: "danger"}
        end
      end
    end

    respond_to do |format|
      format.js { render partial: 'load_assets', collection: messages, as: 'message' }
    end
  end

  def serve_asset
    @game = Game.find_by_id(params[:id])
    asset_name = "#{params[:name]}.#{params[:format]}"
    asset = current_game.assets.find_by_name(asset_name);
    if asset
      # asset found, send the file attached to this asset
      send_data asset.file.download, filename: asset.name, disposition: 'inline'
    else
      render status: 404, json: {
        message: "Asset not found."
      }
    end
  end
end
