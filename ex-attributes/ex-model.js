import exAttribute from "../ex-attribute/ex-attribute.js";

class exModel extends exAttribute {
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