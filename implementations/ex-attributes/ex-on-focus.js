import exAttribute from "../../framework/base/ex-attribute.js";

class exOnFocus extends exAttribute {
    init() {
        this.addEvent("focus", () => { this.runEvent() });
    }
}

export default exOnFocus;