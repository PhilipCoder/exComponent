import exAttribute from "../ex-attribute/ex-attribute.js";
import stateManager from "../ex-component/state/state-manager.js";

class exState extends exAttribute {
    static Priority = 5;
    async connectedCallback() {
        let innerHTML = this.element.innerHTML;
        console.log("state");
        this.element.innerHTML = "";
        let scopeObj = await Function(`return ${this.binding}`)();
        this.element.createContext();
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

            let stateManagerInstance = new stateManager(scopeVarName);
            stateManagerInstance.state = module;
            this.element.context.addVariable(scopeVarName, stateManagerInstance);
        }
        this.element.innerHTML = innerHTML;
    }

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

export default exState;