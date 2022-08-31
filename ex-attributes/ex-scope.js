import exAttribute from "../ex-component/ex-attribute.js";

class exScope extends exAttribute {
    async connectedCallback() {
        let module = await Function(`return import('${this.binding}')`)();
        if (Object.keys(module).length === 0){
            throw `Module ${this.binding} does not provide any exports`;
        }
        
        module = module[Object.keys[0]];
        if (!!module){
            throw `Module ${this.binding} has an invalid export`;
        }

        module = typeof module === "function" ? new module() : module;

        this.element.scope = module;
    }
}

export default exScope;