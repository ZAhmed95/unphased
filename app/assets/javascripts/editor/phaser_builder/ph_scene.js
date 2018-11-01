class PHScene {
  constructor(config){
    this.game = config.game;
    this.name = config.name;
    this.map = config.map;
    this.player = config.player;
    this.camera = config.camera || {scrollX: 0, scrollY: 0};
    this.preload = config.preload || new JSFunctionDefinition({name:'preload' , classMethod: true});
    this.create = config.create || new JSFunctionDefinition({name:'create' , classMethod: true});
    this.update = config.update || new JSFunctionDefinition({name:'update' , classMethod: true, params: ['time','delta']});
  }

  addStatements(options){
    var jsStatements = options.statements.map((statement)=>{return new JSStatement(statement);});
    var func = this[options.functionName];
    var index = (options.index || options.index == 0) ? options.index : func.statements.length;
    func.statements.splice(index,0,...jsStatements);
  }

  setMap(map){
    this.map = map;
  }

  build(){
    var cursors = false;
    // initial setup
    this.addStatements({
      functionName: "create",
      statements: [
        `this.cam = this.cameras.main;`
      ]
    })
    // map setup
    if (this.map){
      let tilesetKeys = this.map.tilesets.map((tileset)=>{return tileset.key});
      let tilesetStatements = tilesetKeys.map((key)=>{
        return `this.map.tilesetImages['${key}'] = this.map.addTilesetImage('${key}');`;
      });
      let layerStatements = this.map.layers.map((layer)=>{
        return `
        this.map.tileLayers['${layer.name}'] = this.map.createDynamicLayer('${layer.name}', tilesets, 0, 0);
        ${layer.collides ? 
          `this.map.tileLayers['${layer.name}'].setCollisionByExclusion([-1]);
          this.collisionLayers.push(this.map.tileLayers['${layer.name}']);
          `
          : ''}
        `
      });
      this.addStatements({
        functionName: "create", 
        statements: [
          `this.collisionLayers = [];`,
          `this.map = this.make.tilemap({key: '${this.map.key}'});`,
          `this.map.tilesetImages = {};`,
          `this.map.tileLayers = {};`,
          ...tilesetStatements,
          `const tilesets = [${tilesetKeys.map((key)=>{return `this.map.tilesetImages['${key}']`}).join(',')}];`,
          ...layerStatements,
        ],
        index: 0,
      })
    }
    // player setup
    if (this.player){
      cursors = true;
      this.addStatements({
        functionName: "create",
        statements: [
          `this.player = this.physics.add.sprite(${this.player.startX}, ${this.player.startY}, '${this.player.key}');`,
          `this.player.speed = 200;`,
          `this.collisionLayers.map((layer)=>{
            this.physics.add.collider(this.player, layer);
          });`,
          `this.cam.startFollow(this.player);`
        ]
      });
      this.addStatements({
        functionName: "update",
        statements: [
          `this.player.setVelocity(0);`,
          `if (this.cursors.right.isDown){
            this.player.setVelocityX(this.player.speed);
          }`,
          `else if (this.cursors.left.isDown){
            this.player.setVelocityX(-this.player.speed);
          }`,
          `if (this.cursors.up.isDown){
            this.player.setVelocityY(-this.player.speed);
          }`,
          `else if (this.cursors.down.isDown){
            this.player.setVelocityY(this.player.speed);
          }`,
          `this.player.body.velocity.normalize().scale(this.player.speed);`
        ]
      })
    }
    if (cursors){
      this.addStatements({
        functionName: 'create',
        statements: [
          `this.cursors = this.input.keyboard.createCursorKeys();`
        ]
      })
    }
    return this.to_js();
  }

  static import(json){
    var config = {};
    config.name = json.name;
    config.game = json.game;
    config.map = json.map;
    config.camera = json.camera;
    config.player = json.player;
    config.preload = JSFunctionDefinition.import(json.preload);
    config.create = JSFunctionDefinition.import(json.create);
    config.update = JSFunctionDefinition.import(json.update);
    return new PHScene(config);
  }

  export(){
    var out = this.to_json();
    // optional exports
    if (this.map) out.map = this.map;
    if (this.player) out.player = this.player;
    return out;
  }

  to_js(){
    return `
class ${this.name} extends Phaser.Scene {
  constructor(){
    super('${this.name}');
  }
  ${this.preload.to_js()}
  ${this.create.to_js()}
  ${this.update.to_js()}
}
`
  }

  to_json(){
    return {
      name: this.name,
      type: 'Scene',
      camera: this.camera,
      preload: this.preload.export(),
      create: this.create.export(),
      update: this.update.export(),
    }
  }
}