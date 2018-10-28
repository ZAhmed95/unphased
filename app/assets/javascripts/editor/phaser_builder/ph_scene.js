class PHScene {
  constructor(config){
    this.name = config.name;
    this.preload = new JSFunctionDefinition({name:'preload' , classMethod: true});
    this.create = new JSFunctionDefinition({name:'create' , classMethod: true});
    this.update = new JSFunctionDefinition({name:'update' , classMethod: true, params: ['time','delta']});
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