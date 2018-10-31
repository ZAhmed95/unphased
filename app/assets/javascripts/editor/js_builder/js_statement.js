class JSStatement {
  constructor(code){
    this.code = code;
  }

  static import(json){
    return new JSStatement(json.code);
  }

  export(){
    return this.to_json();
  }

  to_js(){
    return this.code;
  }

  to_json(){
    return {
      code: this.code
    }
  }
}