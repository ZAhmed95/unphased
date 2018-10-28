class JSStatement {
  constructor(code){
    this.code = code;
  }

  to_js(){
    return this.code;
  }

  to_json(){
    return this.code;
  }
}