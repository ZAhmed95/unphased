// the root class that the new phaser game will be built out of
class PHGame {
  constructor(config){
    this.name = config.name;
    this.config = config.config || new PHConfig();
    this.assets = config.assets || new PHAssetManager({game: this});
    this.scenes = config.scenes || createDefaultScenes.call(this);

    function createDefaultScenes(){
      // default game starts with two scenes: Preloader and Game
      // users can add more
      const preloaderScene = new PHScene({game: this, name: 'PreloaderScene'});
      // the preloader will immediately start the GameScene when its create function is called
      // user can change which scene it calls
      preloaderScene.create.statements.push(new JSStatement("this.scene.start('GameScene');"));

      const gameScene = new PHScene({game: this, name: 'GameScene'});

      return [preloaderScene, gameScene];
    }
  }

  build(){
    // generates all the code to load all assets
    this.assets.loadAssets();
    // to_js will recursively call build on child components
    return this.to_js();
  }

  static import(json){
    if (!json.config){
      // this is a brand new game
      var game = new PHGame(json);
      game.init = true;
      return game;
    }
    // otherwise, import data from the json
    var config = {};
    config.name = json.name;
    config.config = PHConfig.import(json.config);
    config.assets = PHAssetManager.import(json.assets);
    config.scenes = json.scenes.map((scene)=>{
      return PHScene.import(scene);
    })
    var game = new PHGame(config);
    // asset manager and scenes all need reference to game
    game.assets.game = game;
    game.scenes.forEach((scene)=>{scene.game = game});
    return game;
  }

  export(){
    // exports a json object containing all the data built for the game thus far.
    // from this object, the entire game can be recreated by Unphased
    return this.to_json();
  }

  to_js(){
    return `
${
  this.scenes.map((scene)=>{
    return scene.build();
  }).join('\n')
}

const config = ${this.config.build()}

game = new Phaser.Game(config);
`
  }

  to_json(){
    return {
      name: this.name,
      assets: this.assets.export(),
      config: this.config.export(),
      scenes: this.scenes.map((scene)=>{return scene.export()})
    }
  }
}