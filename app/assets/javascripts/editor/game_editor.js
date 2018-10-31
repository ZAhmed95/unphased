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
  const controlAddPlayer = $('#control-add-player').detach();
  const controlPlayer = $('#control-player').detach();
  
  if (!config.config){
    // new game, we'll create a new PHGame instance and save it,
    // then come back to this page
    editor = {};
  }
  else {
    editor = new Phaser.Game({
      type: Phaser.AUTO,
      parent: 'display',
      width: display.width(),
      height: display.height(),
      physics: {
        default: 'arcade',
        arcade: {
          gravity: {y: 0}
        }
      },
      scene: [EditorScene]
    });
  }

  editor.getScene = function(){
    return (editor.editScene || (editor.editScene = editor.scene.scenes[0]));
  }

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
  });
  $('#load-map').click(()=>{
    editor.swapControls(controlLoadMap);
  });
  $('#add-player').click(()=>{
    if (config.scenes[1].player){
      editor.swapControls(controlPlayer);
    }
    else {
      editor.swapControls(controlAddPlayer);
    }
  });
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

  // on the controls for add player:
  body.on('click', '#add-player-submit', (event)=>{
    var files = $('#load-player-spritesheet-input')[0].files;
    if (files.length < 1){
      notify({
        message: 'You have to choose a file first.',
        type: 'danger'
      })
      return;
    }
    var file = files[0];
    var frameWidth = $('#control-add-player input[name=width]')[0];
    var frameHeight = $('#control-add-player input[name=height]')[0];
    if (!frameWidth.value || !frameHeight.value){
      notify({
        message: 'You have to enter values for frame width and height.',
        type: 'danger'
      });
      return;
    }
    loadFile(file, {
      type: 'spritesheet',
      onload: (result)=>{
        result.frameWidth = frameWidth.value;
        result.frameHeight = frameHeight.value;
        // add the new spritesheet key to assets
        editor.gamejs.assets.set(result);
        // if the scene already had a player:
        if (editor.currentScene.player){
          let player = editor.currentScene.player;
          // remove the old spritesheet asset
          editor.gamejs.assets.remove(player.key);
          // update player asset key
          player.key = result.key;
        }
        else {
          // if there wasn't already a player, create a new one
          // with arbitrary spawn position
          editor.currentScene.player = {
            startX: 50,
            startY: 50,
            key: result.key
          }
        }
        
        Rails.fire($('#load-player-spritesheet-form')[0], 'submit');
        notify({
          message: "Added player.",
          type: 'success'
        });
      }
    })
  });

  body.on('click', '#control-add-player-back', ()=>{
    editor.swapControls(controlMenu);
  });

  // on the controls for edit player:
  body.on('click', '#control-player-spawn', ()=>{
    editor.getScene().updatingPlayer = true;
  });

  body.on('click', '#control-player-change-spritesheet', ()=>{
    editor.swapControls(controlAddPlayer);
  });

  body.on('click', '#control-player-back', ()=>{
    editor.swapControls(controlMenu);
  });

  // the gamejs object is a node tree representation of the phaser game being built by the user.
  // when the game is saved to the server, the tree will be parsed and concatenated into one JS file
  editor.gamejs = PHGame.import(config);
  // get the current scene being worked on
  editor.currentScene = editor.gamejs.scenes[1];
  // if gamejs was newly created, save it immediately
  if (editor.gamejs.init){
    // save the newly created game
    $('#save-game').click();
    // refresh the page
    location.reload();
  }
}