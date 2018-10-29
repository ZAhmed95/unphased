// holds all JavaScript for the game editor page
//= require phaser
//= require_tree ./editor

$(document).ready(()=>{
  // DOM references
  const body = $('body');
  const display = $('#display');
  const editorContainer = $('#editor-container');
  const testContainer = $('#test-container');
  const controls = $('#controls');
  const controlMenu = $('#control-menu');
  let currentControl = controlMenu;
  const controlAssets = $('#control-assets').detach();
  const controlLoadMap = $('#control-load-map').detach();

  
  editor = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'display',
    width: display.width(),
    height: display.height(),
    scene: [EditorScene]
  })

  // the gamejs object is a node tree representation of the phaser game being built by the user.
  // when the game is saved to the server, the tree will be parsed and concatenated into one JS file
  editor.gamejs = new PHGame({name: display.data('gameName')});
  // get the current scene being worked on
  editor.currentScene = editor.gamejs.scenes[1];

  // editor interface functions, anything the user can do in the GUI to affect the game,
  // goes through one of these functions
  editor.testGame = function(){
    editorContainer.hide();
    testContainer.show();
    // Convert the js tree into a js string
    var gameCode = editor.gamejs.build();
    // pass it to the Function constructor, and call it
    new Function('parent', gameCode)('test-game');
  }

  editor.editGame = function(){
    game.destroy();
    game = null;
    testContainer.hide();
    editorContainer.show();
  }

  editor.swapControls = function(newControl){
    currentControl.detach();
    currentControl.hide();
    newControl.show();
    controls.append(newControl);
    currentControl = newControl;
  }

  // adding event listeners to GUI elements
  // on the toolbar:
  $('#test-button').click(editor.testGame);

  $('#edit-button').click(editor.editGame);

  // on the controls main menu:
  $('#load-assets').click(()=>{
    editor.swapControls(controlAssets);
  })
  $('#load-map').click(()=>{
    editor.swapControls(controlLoadMap);
  })

  // on the controls for load assets: 
  body.on('submit', 'form#assets-form', (event)=>{
    event.preventDefault();
    files = $('#input-assets')[0].files;
    if (!files.length){
      notify({
        message: 'Please choose at least one file.',
        type: 'danger'
      })
    }
    for (let i = 0; i < files.length; i++){
      let file = files[i];
      loadFile(file, (result)=>{
        editor.gamejs.assets.add(result);
      })
    }
  });

  body.on('click', '#control-assets-back', ()=>{
    editor.swapControls(controlMenu);
  });

  // on the controls for load map:
  body.on('submit', 'form#load-map-form', (event)=>{
    event.preventDefault();
    var files = $('#input-map')[0].files;
    if (files.length < 1){
      notify({
        message: 'You have to choose a file first.',
        type: 'danger'
      })
    }
    var file = files[0];
    loadFile(file, (result)=>{
      console.log(result);
      result.name = editor.currentScene.name + 'Map';
      editor.currentScene.map = Object.assign({}, result);
      result.data = JSON.stringify(result.data);
      editor.gamejs.assets.add(result);
    });
  });

  body.on('click', '#control-load-map-back', ()=>{
    editor.swapControls(controlMenu);
  });

  // helper functions
  function loadFile(file, callback){
    var typeAndExt = file.type.split('/');
    let name = file.name.substring(0, file.name.lastIndexOf('.'));
    let type = typeAndExt[0];
    let fileType = typeAndExt[1];
    var fr = new FileReader();
    fr.addEventListener('load', (event)=>{
      let data = event.target.result;
      if (fileType == 'json') data = JSON.parse(data);
      notify({
        message: `File ${file.name} loaded successfully`,
        type: 'success'
      })
      callback({name, type, fileType, data});
    });
    (fileType == 'json') ? fr.readAsText(file) : fr.readAsDataURL(file);
  }
})
