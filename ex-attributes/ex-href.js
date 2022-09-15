import exModifierAttribute from "../ex-component/ex-modifier-attribute.js";

class exHref extends exModifierAttribute {
    dataCallback(data) {
        this.element.href =data
    }
}

export default exHref;