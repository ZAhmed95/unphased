// the root class that the new phaser game will be built out of
class PHGame {
  constructor(config){
    this.name = config.name;

    // default game starts with two scenes: Preloader and Game
    // users can add more
    const preloaderScene = new PHScene({name: 'PreloaderScene'});
    // the preloader will immediately start the GameScene when its create function is called
    // user can change which scene it calls
    preloaderScene.create.statements.push(new JSStatement("this.scene.start('GameScene');"));

    const gameScene = new PHScene({name: 'GameScene'});

    this.scenes = [preloaderScene, gameScene];
  }

  to_js(){
    return `
${
  this.scenes.map((scene)=>{
    return scene.to_js();
  }).join('\n')
}

new Phaser.Game({
  type: Phaser.AUTO,
  width: 1200,
  height: 800,
  scene: [${this.scenes.map((scene)=>{return scene.name}).join(',')}]
})
`
  }

  to_json(){
    return {
      name: this.name,
      type: 'Game',
      scenes: this.scenes.map((scene)=>{return scene.to_json()})
    }
  }
}