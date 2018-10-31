// This file defines the EditorScene, which is the only scene that will be running
// in the game editor. It will simply load any assets that need to be loaded,
// and allow the user to interact with the display window
function createEditorScene(config){
  console.log(config);
  EditorScene = class extends Phaser.Scene {
    constructor(){
      super('EditorScene');
    }
    preload(){
      var assets = config.assets.assets;
      var path = 'game-assets/';
      Object.keys(assets).map((name)=>{
        var asset = PHAsset.import(assets[name]);
        var code = asset.getLoadStatement(path).to_js();
        // execute the load statement
        new Function(code).call(this);
      });
    }
    create(){
      // create shortcuts to commonly used objects
      this.ui = {};
      this.cam = this.cameras.main;
      // set the bounds which, when crossed by the mouse, will move the camera
      this.cam.moveRightBound = this.game.config.width * 0.9;
      this.cam.moveLeftBound = this.game.config.width * 0.1;
      this.cam.moveUpBound = this.game.config.height * 0.1;
      this.cam.moveDownBound = this.game.config.height * 0.9;
      // speed that the camera moves at, in game pixels per second
      this.cam.speed = 500;
      // set camera position from config
      var configCam = config.scenes[1].camera;
      this.cam.scrollX = configCam.scrollX;
      this.cam.scrollY = configCam.scrollY;
      // set camera bounds. If a map exists, it will change the bounds
      this.cam.setBounds(0,0, 0,0);
      this.pointer = this.input.mousePointer;
      // time to start creating the scene
      var sceneConfig = config.scenes[1];
      // create the map if there is one
      if (sceneConfig.map){
        var map = config.scenes[1].map;
        console.log(map);
        this.map = this.make.tilemap({key: map.key});
        this.map.tilesetImages = {};
        this.map.tilemapLayers = {};
        map.tilesets.map((tileset)=>{
          this.map.tilesetImages[tileset.key] = this.map.addTilesetImage(tileset.key);
        })
        const tilesets = Object.keys(this.map.tilesetImages).map((key)=>{return this.map.tilesetImages[key]});
        map.layers.map((layer)=>{
          this.map.tilemapLayers[layer.name] = this.map.createDynamicLayer(layer.name, tilesets, 0, 0);
        })

        // create UI elements for map
        this.ui.tileX = this.add.text(20,40, 'tileX: 0');
        this.ui.tileX.setScrollFactor(0);
        this.ui.tileY = this.add.text(150,40, 'tileY: 0');
        this.ui.tileY.setScrollFactor(0);

        // set new camera bounds based on map dimensions
        this.cam.setBounds(-100,-100, this.map.widthInPixels+200,this.map.heightInPixels+200);
      }

      // create the player if there is one
      if (sceneConfig.player){
        let player = sceneConfig.player;
        this.player = this.physics.add.sprite(player.startX, player.startY, player.key);
      }

      // create UI text for mouse movement
      this.ui.mouseX = this.add.text(20,20, 'mouseX: 0');
      this.ui.mouseX.setScrollFactor(0);
      this.ui.mouseY = this.add.text(150,20, 'mouseY: 0');
      this.ui.mouseY.setScrollFactor(0);

      // update UI mouse positions on pointer move
      this.input.on('pointermove', ()=>{
        var ui = this.ui;
        var {x,y} = this.getMousePosition();
        ui.mouseX.setText(`mouseX: ${x}`);
        ui.mouseY.setText(`mouseY: ${y}`);
        if (this.map){
          var {tileX, tileY} = this.toTileCoords(x,y);
          ui.tileX.setText(`tileX: ${tileX}`);
          ui.tileY.setText(`tileY: ${tileY}`);
        }
      });
    }
    update(time,delta){
      // convert delta to s from ms
      delta /= 1000;
      // check if we need to move the camera based on mouse position
      this.moveCamera(delta);
    }

    // helper functions
    toTileCoords(x,y){
      var tileX = Math.floor(x / this.map.tileWidth);
      var tileY = Math.floor(y / this.map.tileHeight);
      return {tileX, tileY};
    }

    getMousePosition(relative=false){
      var scrollX = relative ? 0 : this.cam.scrollX;
      var scrollY = relative ? 0 : this.cam.scrollY;
      var x = Math.floor(scrollX + this.pointer.x);
      var y = Math.floor(scrollY + this.pointer.y);
      return {x,y};
    }

    moveCamera(delta){
      var {x,y} = this.getMousePosition(true);
      var moveAmount = this.cam.speed * delta;
      var moved = false;
      // move left/right
      if (x > this.cam.moveRightBound){
        this.cam.scrollX += moveAmount;
        moved = true;
      }
      else if (x < this.cam.moveLeftBound){
        this.cam.scrollX -= moveAmount;
        moved = true;
      }
      // move up/down
      if (y > this.cam.moveDownBound){
        this.cam.scrollY += moveAmount;
        moved = true;
      }
      else if (y < this.cam.moveUpBound){
        this.cam.scrollY -= moveAmount;
        moved = true;
      }

      if (moved){
        // update the PHGame camera object
        editor.currentScene.camera.scrollX = this.cam.scrollX;
        editor.currentScene.camera.scrollY = this.cam.scrollY;
        moved = false;
      }
    }
  }
}