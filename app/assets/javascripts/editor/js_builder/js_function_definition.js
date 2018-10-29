class JSFunctionDefinition {
  constructor(config){
    // class methods don't begin with the 'function' keyword
    this.keyword = config.classMethod ? "" : "function ";
    this.name = config.name || "";
    this.params = config.params || [];
    this.statements = config.statements || [];
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
      type: 'Function Definition',
      name: this.name,
      params: this.params,
      statements: this.statements.map((statement)=>{return statement.export()})
    }
  }
}