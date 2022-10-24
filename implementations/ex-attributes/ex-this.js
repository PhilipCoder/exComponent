import exAttribute from "../../framework/base/ex-attribute.js";

class exThis extends exAttribute {
    async onConnected() {
        this.scope.$(`${this.binding} = ${this.binding}.bind(elm)`, { elm: this.element });
    }
}

export default exThis;