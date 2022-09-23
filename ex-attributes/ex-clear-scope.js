import exAttribute from "../ex-attribute/ex-attribute.js";

class exClearState extends exAttribute {
    static Priority = 5;
    async connectedCallback() {
        this.element.createContext(true);
    }
}

export default exClearState;