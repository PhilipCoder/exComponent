import exModifierAttribute from "../ex-component/ex-modifier-attribute.js";

class exModel extends exModifierAttribute {
    dataCallback(data) {
        this.element.value = data;
    }

    afterConnected() {
        this.element.addEventListener("input", () => { 
            this.runEvent() 
        });
    }

    runEvent() {
        this.context.executeScopedExpression(`${this.binding} = elementValue`, { elementValue: this.element.value });
    }
}

export default exModel;