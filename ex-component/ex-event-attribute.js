import exAttribute from "./ex-attribute.js";

class exEventAttribute extends exAttribute {
    runEvent(binding = this.binding) {
        this.context.executeScopedExpression(binding);
    }
}

export default exEventAttribute;