import exAttribute from "../ex-component/ex-attribute.js";

class exOnFocus extends exAttribute {
    init() {
        this.addEvent("focus", () => { this.runEvent() });
    }
}

export default exOnFocus;