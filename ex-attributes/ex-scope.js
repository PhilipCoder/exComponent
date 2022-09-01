import exAttribute from "../ex-component/ex-attribute.js";

class exScope extends exAttribute {
    static Priority = 1;
    async connectedCallback() {
        let module = await Function(`return import('${this.binding}')`)();
        if (Object.keys(module).length === 0) {
            throw `Module ${this.binding} does not provide any exports`;
        }

        let moduleName = Object.keys(module)[0];
        module = module[moduleName];
        if (!module) {
            throw `Module ${this.binding} has an invalid export`;
        }

        let state = this.element.state && this.element.state.state;
        module = await this.getModuleInstance(module, state);

        this.element.scope = module;
    }

    async getModuleInstance(moduleDefinition,state) {
        if (typeof moduleDefinition === "function") {
            if (moduleDefinition.prototype) {
                return new moduleDefinition(state);
            }
            return await moduleDefinition(state);
        }
        return moduleDefinition;
    }
}

export default exScope;