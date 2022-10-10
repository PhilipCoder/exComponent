import { arrayToObject } from "../helpers/object.js"

/**
 * The context class is the class  that should contain
 */
class context {
    scopedVariables = {};
    constructor(scopedVariables = {}, newObjectInstance = false) {
        this.scopedVariables = newObjectInstance ? Object.assign({}, scopedVariables) : scopedVariables;
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
        let result = Object.assign({}, this.scopedVariables);
        Object.keys(result).forEach(x => result[x] = result[x].__boundProp ? result[x][result[x].__boundProp] : result[x]);
        return result;
    }

    #getScopedVariables() {
        let scopeNames = Object.keys(this.scopedVariables);
        let scopeValues = Object.keys(this.scopedVariables).map(x => this.scopedVariables[x].__boundProp ? this.scopedVariables[x][this.scopedVariables[x].__boundProp] : this.scopedVariables[x]);
        return { scopeNames, scopeValues };
    }

    executeScopedExpression(expression, parameters = {}) {
        let scopeVars = this.#getScopedVariables();
        Object.keys(parameters).forEach(x => { 
            scopeVars.scopeNames.push(x);
            scopeVars.scopeValues.push(parameters[x]);
         })
        return Function(...scopeVars.scopeNames, `return ${expression}`)(...scopeVars.scopeValues);
    }

    executeScopedStatement(expression, parameters = {}) {
        let scopeVars = this.#getScopedVariables();
        Object.keys(parameters).forEach(x => { 
            scopeVars.scopeNames.push(x);
            scopeVars.scopeValues.push(parameters[x]);
         })
        return Function(...scopeVars.scopeNames, `${expression}`)(...scopeVars.scopeValues);
    }

    getOfType(type) {
        let scopeVars = Object.keys(this.scopedVariables).map(x => this.scopedVariables[x]);
        return scopeVars.filter(x => x instanceof type);
    }

    getScopedVariables() {
        return Object.assign({}, this.scopedVariables);
    }
}

export { context };