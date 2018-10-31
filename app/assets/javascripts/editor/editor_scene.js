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
      var map = config.scenes[1].map;
      if(map){
        console.log(map);
        this.map = this.make.tilemap({key: map.key});
        this.map.tilesetImages = {};
        this.map.tilemapLayers = {};
        map.tilesets.map((tileset)=>{
          console.log(tileset.key);
          this.map.tilesetImages[tileset.key] = this.map.addTilesetImage(tileset.key);
        })
        const tilesets = Object.keys(this.map.tilesetImages).map((key)=>{return this.map.tilesetImages[key]});
        map.layers.map((layer)=>{
          console.log(layer.name);
          this.map.tilemapLayers[layer.name] = this.map.createDynamicLayer(layer.name, tilesets, 0, 0);
        })
      }
    }
    update(time,delta){
    }
  }
}