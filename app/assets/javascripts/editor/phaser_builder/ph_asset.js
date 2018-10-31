class PHAsset {
  constructor(config){
    this.assetManager = config.assetManager;
    this.name = config.name;
    this.key = config.key;
    this.type = config.type;
    this.fileType = config.fileType;
    this.data = config.data;
    this.frameWidth = config.frameWidth;
    this.frameHeight = config.frameHeight;
  }

  path(){
    return this.assetManager.baseURL;
  }

  static import(json){
    return new PHAsset(json);
  }

  export(){
    return this.to_json();
  }

  getLoadStatement(path){
    var key = this.key;
    var path = (path || this.path()) + this.name;
    var code;
    switch(this.type){
      case 'image':
      code = `this.load.image('${key}', '${path}');`
      break;

      case 'spritesheet':
      let x = this.frameWidth;
      let y = this.frameHeight;
      code = `this.load.spritesheet('${key}', '${path}', { frameWidth: ${x}, frameHeight: ${y} });`;
      break;

      case 'json':
      code = `this.load.json('${key}', '${path}');`;
      break;

      case 'audio':
      code = `this.load.audio('${key}', '${path}');`;
      break;

      case 'map':
      code = `this.load.tilemapTiledJSON('${key}', '${path}');`;
      break;

    }
    return new JSStatement(code);
  }

  to_json(){
    var out = {
      name: this.name,
      key: this.key,
      type: this.type,
      path: this.path,
      fileType: this.fileType,
      data: this.data,
    }
    if (this.frameWidth){
      out.frameWidth = this.frameWidth;
      out.frameHeight = this.frameHeight;
    }
    return out;
  }
}