class PHAsset {
  constructor(config){
    this.name = config.name;
    this.type = config.type;
    this.fileType = config.fileType;
    this.data = config.data;
  }

  to_js(){
    switch(this.type){
      case 'image':
      return `this.textures.addBase64('${this.name}', assets['${this.name}']);`

      case 'spritesheet':
      var imgName = this.name + 'Image';
      return `
var ${imgName} = new Image();
${imgName}.onload = () => {
  this.textures.addSpriteSheet('${this.name}', ${imgName}, {frameWidth: ${this.x}, frameHeight: ${this.y}});
}
${imgName}.src = assets['${this.name}'];
`
      case 'application': // this is JSON
      return `this.cache.json.add('${this.name}', assets['${this.name}']);`
    }
  }
}