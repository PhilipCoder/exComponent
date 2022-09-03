/**
 * The context class is the class  that should contain
 */
class context {
    scopedVariables = [];
    constructor(scopedVariables = []){
        this.scopedVariables = scopedVariables;
    }
    addVariable(name, value) {
        this.scopedVariables.push({ name, value });
    }

    getVariable(name){
        return this.scopedVariables[name];
    }

    executeScopedExpression(expression){
        let scopeNames = Object.keys(this.scopedVariables);
        let scopeValues = scopeNames.map(x=>this.scopedVariables[x])
        return Function(...scopeNames, `return ${expression}`)(...scopeValues);
    }

    executeScopedStatement(expression){
        let scopeNames = Object.keys(this.scopedVariables);
        let scopeValues = scopeNames.map(x=>this.scopedVariables[x])
        return Function(...scopeNames, `${expression}`)(...scopeValues);
    }

    getScopedVariables(){
        return this.scopedVariables;
    }
}

export { context };