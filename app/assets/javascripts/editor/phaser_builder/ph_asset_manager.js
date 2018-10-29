class PHAssetManager {
  constructor(game){
    this.game = game;
    this.baseURL = '/game-assets/'
    this.assets = {};
  }

  add(config){
    config.assetManager = this;
    var asset = new PHAsset(config);
    this.assets[asset.name] = asset;
  }

  remove(name){
    delete this.assets[name];
  }

  export(){
    var output = {};
    for (let key in this.assets){
      output[key] = this.assets[key].export();
    }
    return output;
  }

  buildAssets(){
    // output the assets object, which holds all game assets as base64 strings
    var output = `
const assets = {
  ${
    Object.keys(this.assets).map((key)=>{
      let asset = this.assets[key];
      return (asset.fileType == 'json') ? 
             `"${asset.name}": ${asset.data}` : // JSON data won' have double quotes, as it's a JS object
             `"${asset.name}": "${asset.data}"`; // other types are data URI strings, so they have quotes
    }).join(',\n  ')
  }
}
`
    this.loadAssets();
    return output;
  }

  loadAssets(){
    // insert the statements to load each asset into the Preloader scene
    var preloader = this.game.scenes[0];
    var preloadStatements = preloader.preload.statements;
    var statements = [];
    for (let key in this.assets){
      statements.push(this.assets[key]);
    }
    preloadStatements.splice(preloadStatements.length, 0, ...statements);
  }
}