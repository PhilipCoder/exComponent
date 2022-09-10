import { arrayToObject } from "../helpers/object.js"

/**
 * The context class is the class  that should contain
 */
class context {
    scopedVariables = {};
    constructor(scopedVariables = {}) {
        this.scopedVariables = scopedVariables;
    }
    addVariable(name, value) {
        if (typeof value === "string" || typeof value === "number" || typeof value === "undefined") {
            throw "Invalid context type applied";
        }
        this.scopedVariables[name] = value;
    }

    getVariable(name) {
        return this.scopedVariables[name]
    }

    getScopedVariablesObj() {
        let result = Object.assign({},this.scopedVariables);
        Object.keys(result).forEach(x => result[x]= result[x].boundProp ? result[x][result[x].boundProp] : result[x]);
        return result;
    }

    #getScopedVariables(){
        let scopeNames = Object.keys(this.scopedVariables);
        let scopeValues = Object.keys(this.scopedVariables).map(x => this.scopedVariables[x].boundProp ? this.scopedVariables[x][this.scopedVariables[x].boundProp] : this.scopedVariables[x]);
        return {scopeNames, scopeValues};
    }

    executeScopedExpression(expression) {
        let scopeVars = this.#getScopedVariables();
        return Function(...scopeVars.scopeNames, `return ${expression}`)(...scopeVars.scopeValues);
    }

    executeScopedStatement(expression) {
        let scopeVars = this.#getScopedVariables();
        return Function(...scopeVars.scopeNames, `${expression}`)(...scopeVars.scopeValues);
    }

    getOfType(type) {
        let scopeVars =   Object.keys(this.scopedVariables).map(x =>  this.scopedVariables[x]);
        return scopeVars.filter(x => x instanceof type);
    }

    getScopedVariables() {
        return Object.assign({},this.scopedVariables);
    }
}

export { context };