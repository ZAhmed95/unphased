class PHScene {
  constructor(config){
    this.game = config.game;
    this.name = config.name;
    this.preload = new JSFunctionDefinition({name:'preload' , classMethod: true});
    this.create = new JSFunctionDefinition({name:'create' , classMethod: true});
    this.update = new JSFunctionDefinition({name:'update' , classMethod: true, params: ['time','delta']});
  }

  build(){
    // create the code to initialize the map
    if (this.map){
      let data = this.map.data;
      // add map creation logic to scene create function
      let tileSetStatements = data.tilesets.map((tileset)=>{
        return new JSStatement(
          `this.map.addTileSetImage('${tileset.image.substring(0,tileset.image.lastIndexOf('.'))}');`
        );
      })
      this.create.statements.splice(0,0, 
        new JSStatement(`this.map = this.make.tilemap({key: '${this.map.name}'});`), 
        ...tileSetStatements
      )
    }
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
      preload: this.preload.to_json(),
      create: this.create.to_json(),
      update: this.update.to_json(),
    }
  }
}