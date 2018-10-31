// holds all JavaScript for the game editor page
//= require phaser
//= require_tree ./editor

$(document).ready(()=>{

  loadGameData((data)=>{
    createEditorScene(data);
    createGameEditor(data);
  });
})
