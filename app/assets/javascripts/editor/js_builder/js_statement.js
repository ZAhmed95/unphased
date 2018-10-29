class JSStatement {
  constructor(code){
    this.code = code;
  }

  export(){
    return this.to_json();
  }

  to_js(){
    return this.code;
  }

  to_json(){
    return {
      type: 'Statement',
      code: this.code
    }
  }
}