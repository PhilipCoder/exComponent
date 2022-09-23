import exAttribute from "../ex-attribute/ex-attribute.js";

class exThis extends exAttribute {
    async connectedCallback() {
        this.context.executeScopedStatement(`${this.binding} = ${this.binding}.bind(elm)`, { elm: this.element });
    }
}

export default exThis;