import exAttribute from "../../framework/base/ex-attribute.js";

class exState extends exAttribute {
    static Priority = 5;
    async onConnected() {
        let innerHTML = this.element.innerHTML;
        this.element.innerHTML = "";
        let scopeObj = await Function(`return ${this.binding}`)();
        this.element.createScope(true, true);
     
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
            this.scope[scopeVarName] = module;
            this.scope.observe(scopeVarName);
        }
        this.element.innerHTML = innerHTML;
    }

    async getModuleInstance(moduleDefinition) {
        if (typeof moduleDefinition === "function") {
            if (moduleDefinition.prototype) {
                return new moduleDefinition(this.state?._target || {});
            }
            return await moduleDefinition(this.state?._target || {});
        }
        return moduleDefinition;
    }
}

export default exState;