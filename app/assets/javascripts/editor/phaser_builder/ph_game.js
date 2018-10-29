// the root class that the new phaser game will be built out of
class PHGame {
  constructor(config){
    this.name = config.name;
    this.assets = new PHAssetManager(this);

    // default game starts with two scenes: Preloader and Game
    // users can add more
    const preloaderScene = new PHScene({game: this, name: 'PreloaderScene'});
    // the preloader will immediately start the GameScene when its create function is called
    // user can change which scene it calls
    preloaderScene.create.statements.push(new JSStatement("this.scene.start('GameScene');"));

    const gameScene = new PHScene({game: this, name: 'GameScene'});

    this.scenes = [preloaderScene, gameScene];
  }

  build(){
    var assets = this.assets.buildAssets();
    this.scenes.forEach((scene)=>{scene.build()});
    return assets + this.to_js();
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
    return scene.to_js();
  }).join('\n')
}

game = new Phaser.Game({
  type: Phaser.AUTO,
  width: 1200,
  height: 800,
  parent: parent,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {y: 500},
    }
  },
  scene: [${this.scenes.map((scene)=>{return scene.name}).join(',')}]
})
`
  }

  to_json(){
    return {
      name: this.name,
      type: 'Game',
      assets: this.assets.export(),
      scenes: this.scenes.map((scene)=>{return scene.export()})
    }
  }
}