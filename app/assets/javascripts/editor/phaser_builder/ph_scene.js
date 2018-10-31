class PHScene {
  constructor(config){
    this.game = config.game;
    this.name = config.name;
    this.map = config.map;
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
    if (this.map){
      let tilesetKeys = this.map.tilesets.map((tileset)=>{return tileset.key});
      let tilesetStatements = tilesetKeys.map((key)=>{
        return `this.map.tilesetImages['${key}'] = this.map.addTilesetImage('${key}');`;
      });
      let layerStatements = this.map.layers.map((layer)=>{
        return `this.map.tileLayers['${layer.name}'] = this.map.createDynamicLayer('${layer.name}', tilesets, 0, 0);`
      });
      this.addStatements({
        functionName: "create", 
        statements: [
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
    return this.to_js();
  }

  static import(json){
    var config = {};
    config.name = json.name;
    config.game = json.game;
    config.map = json.map;
    config.preload = JSFunctionDefinition.import(json.preload);
    config.create = JSFunctionDefinition.import(json.create);
    config.update = JSFunctionDefinition.import(json.update);
    return new PHScene(config);
  }

  export(){
    var out = this.to_json();
    if (this.map) out.map = this.map;
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
      preload: this.preload.export(),
      create: this.create.export(),
      update: this.update.export(),
    }
  }
}