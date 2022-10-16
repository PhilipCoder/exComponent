import exAttribute from "../ex-attribute/ex-attribute.js";

class exClearState extends exAttribute {
    static Priority = 5;
    dataCallback(data) {
        this.element.createContext(true, true, data ?? []);
    }
}

export default exClearState;