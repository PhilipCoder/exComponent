import exEventAttribute from "../ex-component/ex-event-attribute.js";

class exOnFocus extends exEventAttribute {
    init() {
        this.addEvent("focus", () => { this.runEvent() });
    }
}

export default exOnFocus;