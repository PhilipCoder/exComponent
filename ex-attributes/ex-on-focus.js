import exAttribute from "../ex-attribute/ex-attribute.js";

class exOnFocus extends exAttribute {
    init() {
        this.addEvent("focus", () => { this.runEvent() });
    }
}

export default exOnFocus;