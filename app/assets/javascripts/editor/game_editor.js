// This file defines the main functionality of the editor,
// i.e. what every button does, what the display shows, etc.
function createGameEditor(config){
  // DOM references
  const body = $('body');
  const userData = $('#user-data')[0].dataset;
  const gameId = userData.gameId;
  const display = $('#display');
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
  editor.gamejs = PHGame.import(config);
  // get the current scene being worked on
  editor.currentScene = editor.gamejs.scenes[1];

  // editor interface functions, anything the user can do in the GUI to affect the game,
  // goes through one of these functions
  editor.swapControls = function(newControl){
    currentControl.detach();
    currentControl.hide();
    newControl.show();
    controls.append(newControl);
    currentControl = newControl;
  }

  editor.loadMap = function(file, callback){
    loadJSON(file, {
      key: editor.currentScene.name + 'Map',
      type: 'map',
      onload: (result)=>{
        // flag to be set false if all tileset assets could not be found
        var allAssetsExist = true;
        var assetManager = editor.gamejs.assets;
        // strip the data to only leave the properties we want
        result.tilesets = result.data.tilesets.map((tileset)=>{
          let name = tileset.image;
          let key = tileset.name;
          let asset;
          // check if the asset for this tileset has been loaded
          if (asset = assetManager.get(name)){
            notify({
              message: `Found ${asset.name}`,
              type: 'success',
            });
            // update the asset in the manager
            asset.key = key;
            assetManager.set(asset);
          }
          else {
            allAssetsExist = false;
            notify({
              message: `Could not find: ${name}`,
              type: 'danger'
            });
          }
          return {key, name};
        });
        result.layers = result.data.layers.map((layer)=>{
          return {name: layer.name};
        })
        
        console.log(result);
        // remove the data property, it has unnecessary bloat
        delete result.data;
        // only continue if all assets were found
        if(allAssetsExist) {
          editor.currentScene.setMap(Object.assign({}, result));
          editor.gamejs.assets.set(result);
          callback();
        }
      },
      map: true
    });
  }

  editor.saveGame = function(event){
    var authToken = $('#save-game-form>input[name=authenticity_token]')[0].value;
    console.log(authToken);
    event.preventDefault();
    $.ajax(`/editor/${gameId}/save`, {
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        user_id: userData.userId,
        game_id: userData.gameId,
        authenticity_token: authToken,
        game: editor.gamejs.export(),
      }),
      success: (response)=>{
        console.log(response);
        notify({
          message: 'Successfully saved game.',
          type: 'success'
        })
      },
      error: (error)=>{
        console.log(error);
        notify({
          message: "Something went wrong. Could not save game.",
          type: "danger"
        })
      }
    })
  }

  // adding event listeners to GUI elements
  // on the controls main menu:
  $('#load-assets').click(()=>{
    editor.swapControls(controlAssets);
  })
  $('#load-map').click(()=>{
    editor.swapControls(controlLoadMap);
  })
  $('#save-game').click(editor.saveGame);

  // on the controls for load assets: 
  body.on('click', '#load-assets-submit', (event)=>{
    files = $('#load-assets-input')[0].files;
    if (!files.length){
      notify({
        message: 'Please choose at least one file.',
        type: 'danger'
      });
      return;
    }
    for (let i = 0; i < files.length; i++){
      let file = files[i];
      loadFile(file, {
        onload: (result)=>{
          editor.gamejs.assets.set(result);
        }
      })
    }
    // fire the rails ujs form submission
    Rails.fire($('#load-assets-form')[0], 'submit');
  });

  body.on('click', '#control-assets-back', ()=>{
    editor.swapControls(controlMenu);
  });

  // on the controls for load map:
  body.on('click', '#load-map-submit', (event)=>{
    var files = $('#load-map-input')[0].files;
    if (files.length < 1){
      notify({
        message: 'You have to choose a file first.',
        type: 'danger'
      })
      return;
    }
    var file = files[0];
    editor.loadMap(file, ()=>{
      // map load successful, i.e. all assets required by map
      // exists. To save map to DB,
      // fire the rails ujs form submission
      Rails.fire($('#load-map-form')[0], 'submit');
    })
  });

  body.on('click', '#control-load-map-back', ()=>{
    editor.swapControls(controlMenu);
  });
}