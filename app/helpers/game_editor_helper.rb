module GameEditorHelper
  def current_game
    @game ||= current_user.games.find_by_id(session[:game_id])
  end
end
