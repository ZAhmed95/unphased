class PHConfig {
  constructor(config = {}){
    this.type = config.type || 'Phaser.AUTO';
    this.width = config.width || 800;
    this.height = config.height || 600;
    this.parent = config.parent || 'parent';
    this.physics = config.physics || {
      default: 'arcade',
      arcade: {
        gravity: {y: 0}
      }
    };
    this.scene = config.scene || ['PreloaderScene', 'GameScene'];
  }

  static import(json){
    return new PHConfig(json);
  }

  export(){
    return {
      type: this.type,
      width: this.width,
      height: this.height,
      parent: this.parent,
      physics: this.physics,
      scene: this.scene,
    }
  }

  build(){
    return this.to_js();
  }

  to_js(){
    return `{
  type: ${this.type},
  width: ${this.width},
  height: ${this.height},
  parent: ${this.parent},
  physics: ${JSON.stringify(this.physics)},
  scene: [${this.scene.map((scene)=>{return scene}).join(',')}]
}
`
  }
}