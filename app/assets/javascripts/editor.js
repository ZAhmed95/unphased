// holds all JavaScript for the game editor page
//= require phaser
//= require_tree ./editor

$(document).ready(()=>{

  const display = $('#display');
  
  editor = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'display',
    width: display.width(),
    height: display.height(),
    scene: [EditorScene]
  })
  console.log(display.data('gameName'));
  // the js object is a node tree representation of the phaser game being built by the user.
  // when the game is saved to the server, the tree will be parsed and concatenated into one JS file
  editor.js = new PHGame({name: display.data('gameName')});

  console.log(JSON.stringify(editor.js.to_json()));
})
