class GameEditorController < ApplicationController
  def current_game
    @game ||= current_user.games.find_by_id(session[:game_id])
  end

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
    session[:game_id] = @game.id;
  end

  def save
    p params
    render json: params.to_json
  end

  def load_assets
    @data = params[:assets]
    messages = []
    unless @data
      message = {message: "No files uploaded.", type: "danger"}
      return render partial: 'load_assets', locals: {message: message}
    end

    @data.each do |file|
      if asset = current_game.assets.find_by_name(file.original_filename)
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
        asset = current_game.assets.create!(
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
