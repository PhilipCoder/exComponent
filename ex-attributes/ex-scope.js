import exAttribute from "../ex-component/ex-attribute.js";

class exScope extends exAttribute {
    static Priority = 1;
    async connectedCallback() {
        let scopeObj = await Function(`return ${this.binding}`)();
        for (let scopeVarName in scopeObj) {
            let module = await Function(`return import('${scopeObj[scopeVarName]}')`)();
            if (Object.keys(module).length === 0) {
                throw `Module ${this.binding} does not provide any exports`;
            }

            let moduleName = Object.keys(module)[0];
            module = module[moduleName];
            if (!module) {
                throw `Module ${this.binding} has an invalid export`;
            }

            module = await this.getModuleInstance(module);

            this.element.createContext();
            this.element.context.addVariable(scopeVarName, module);
        }
    }

    //Module parameters should be in the following format: ({scope1, scope, state})
    async getModuleInstance(moduleDefinition) {
        if (typeof moduleDefinition === "function") {
            if (moduleDefinition.prototype) {
                return new moduleDefinition(this.context?.getScopedVariablesObj() || {});
            }
            return await moduleDefinition(this.context?.getScopedVariablesObj() || {});
        }
        return moduleDefinition;
    }
}

export default exScope;