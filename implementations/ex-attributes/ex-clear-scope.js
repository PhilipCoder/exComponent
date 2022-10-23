import exAttribute from "../../framework/base/ex-attribute.js";

class exClearState extends exAttribute {
    static Priority = 5;
    dataCallback(data) {
        this.element.createScope(true, true, data ?? []);
    }
}

export default exClearState;