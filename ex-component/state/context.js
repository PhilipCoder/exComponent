import { arrayToObject } from "../helpers/object.js"

/**
 * The context class is the class  that should contain
 */
class context {
    scopedVariables = [];
    constructor(scopedVariables = []) {
        this.scopedVariables = scopedVariables;
    }
    addVariable(name, value) {
        if (typeof value === "string" || typeof value === "number" || typeof value === "undefined") {
            throw "Invalid context type applied";
        }
        this.scopedVariables.push({ name, value });
    }

    getVariable(name) {
        return this.scopedVariables.filter(x => x.name == name)[0]?.value;
    }

    getScopedVariablesObj() {
        return arrayToObject(this.scopedVariables, (x) => x.name, (x) => x.value.boundProp ? x.value[x.value.boundProp] : x.value);
    }

    executeScopedExpression(expression) {
        let scopeNames = this.scopedVariables.map(x => x.name);
        let scopeValues = this.scopedVariables.map(x => x.value.boundProp ? x.value[x.value.boundProp] : x.value);
        return Function(...scopeNames, `return ${expression}`)(...scopeValues);
    }

    executeScopedStatement(expression) {
        let scopeNames = this.scopedVariables.map(x => x.name);
        let scopeValues = this.scopedVariables.map(x => x.value.boundProp ? x.value[x.value.boundProp] : x.value);
        return Function(...scopeNames, `${expression}`)(...scopeValues);
    }

    getOfType(type) {
        return this.scopedVariables.filter(x => x.value instanceof type).map(x => x.value);
    }

    getScopedVariables() {
        return this.scopedVariables;
    }
}

export { context };