import exAttribute from "./ex-attribute.js";

class exEventAttribute extends exAttribute {
    runEvent() {
        this.context.executeScopedExpression(this.binding);
    }
}

export default exEventAttribute;