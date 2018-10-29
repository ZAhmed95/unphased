class PHAsset {
  constructor(config){
    this.assetManager = config.assetManager;
    this.name = config.name;
    this.key = key;
    this.type = config.type;
    this.fileType = config.fileType;
    this.data = config.data;
  }

  path(){
    return this.assetManager.baseURL + this.name;
  }

  export(){
    return this.to_json();
  }

  to_js(){
    var key = this.key();
    var path = this.path();
    switch(this.type){
      case 'image':
      return `this.load.image('${key}', '${path}');`

      case 'spritesheet':
      let x = this.frameWidth;
      let y = this.frameHeight;
      return `this.load.spritesheet([{ file: '${path}', key: '${key}', config: { frameWidth: ${x}, frameHeight: ${y} } }]);`

      case 'application': // this is JSON
      return `this.cache.json.add('${this.name}', assets['${this.name}']);`
    }
  }

  to_json(){
    return {
      name: this.name,
      type: this.type,
      path: this.path,
      fileType: this.fileType,
      data: this.data,
    }
  }
}