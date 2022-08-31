import exAttribute from "../ex-component/ex-attribute.js";
import stateManager from "../ex-component/state/state-manager.js";

class exState extends exAttribute {
    async connectedCallback() {
        let innerHTML = this.element.innerHTML;
        this.element.innerHTML = "";
        let module = await Function(`return import('${this.binding}')`)();
        if (Object.keys(module).length === 0){
            throw `Module ${this.binding} does not provide any exports`;
        }
        let moduleName = Object.keys(module)[0];
        module = module[moduleName];
        if (!module){
            throw `Module ${this.binding} has an invalid export`;
        }

        module = typeof module === "function" ? new module() : module;

        let stateManagerInstance = new stateManager();
        stateManagerInstance.state = module;
        this.element.state = stateManagerInstance;
        this.element.innerHTML = innerHTML;
    }
}

export default exState;