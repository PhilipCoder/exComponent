import exAttribute from "./ex-attribute.js";

class exEventAttribute extends exAttribute {
    runEvent() {
        let state = this.element.state.state;
        let scope = this.element.scope;
        Function("state", "scope", `${this.binding}`)(state, scope);
    }
}

export default exEventAttribute;