import exAttribute from "./ex-attribute.js";

class exEventAttribute extends exAttribute {
    constructor(element, binding) {
        super(element)
        this.binding = binding;
    }

    runEvent() {
        let state = this.element.state.state;
        let scope = this.element.scope;
        Function(`${this.binding}`)();
    }
}

export default exEventAttribute;