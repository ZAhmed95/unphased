class JSFunctionDefinition {
  constructor(config){
    // class methods don't begin with the 'function' keyword
    this.keyword = config.classMethod ? "" : "function ";
    this.classMethod = config.classMethod;
    this.name = config.name || "";
    this.params = config.params || [];
    this.statements = config.statements || [];
  }

  static import(json){
    var config = {};
    config.classMethod = json.classMethod;
    config.name = json.name;
    config.params = json.params;
    config.statements = json.statements.map((statement)=>{
      return JSStatement.import(statement);
    })
    return new JSFunctionDefinition(config);
  }

  export(){
    return this.to_json();
  }

  to_js(){
    return `
${this.keyword}${this.name}(${this.params.join(',')}){
  ${
    this.statements.map((statement)=>{
      return statement.to_js();
    }).join('\n  ')
  }
}
`
  }

  to_json(){
    return {
      classMethod: this.classMethod,
      name: this.name,
      params: this.params,
      statements: this.statements.map((statement)=>{return statement.export()})
    }
  }
}