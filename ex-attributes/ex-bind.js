import exModifierAttribute from "../ex-component/ex-modifier-attribute.js";

class exBind extends exModifierAttribute {
    dataCallback(data) {
        this.element.innerHTML = data;
    }
}

export default exBind;