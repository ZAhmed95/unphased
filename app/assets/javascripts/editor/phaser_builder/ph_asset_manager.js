class PHAssetManager {
  constructor(config){
    this.game = config.game;
    this.baseURL = config.baseURL || 'game-assets/';
    this.assets = config.assets || {};
  }

  get(name){
    return this.assets[name];
  }

  set(config){
    config.assetManager = this;
    var asset = new PHAsset(config);
    this.assets[asset.name] = asset;
  }

  remove(name){
    delete this.assets[name];
  }

  static import(json){
    var config = {};
    config.baseURL = json.baseURL;
    config.assets = {};
    // construct a PHAsset object from the each entry in the json.assets object
    // store it in the same key in config.assets
    Object.keys(json.assets).map((name)=>{
      config.assets[name] = PHAsset.import(json.assets[name]);
    })
    var assetManager = new PHAssetManager(config);
    // now that the AM is created, iterate through each asset in assets and
    // give each one a reference to the AM
    Object.keys(assetManager.assets).map((name)=>{
      assetManager.assets[name].assetManager = assetManager;
    })
    return assetManager;
  }

  export(){
    this.loadAssets();
    var output = {};
    output.baseURL = this.baseURL;
    output.assets = {};
    for (let name in this.assets){
      output.assets[name] = this.assets[name].export();
    }
    return output;
  }

  loadAssets(){
    // insert the statements to load each asset into the Preloader scene
    var preloader = this.game.scenes[0];
    var statements = [];
    for (let name in this.assets){
      statements.push(this.assets[name].getLoadStatement());
    }
    preloader.preload.statements = statements;
  }
}