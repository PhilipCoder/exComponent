import exModifierAttribute from "../ex-component/ex-modifier-attribute.js";

class exDisabled extends exModifierAttribute {
    dataCallback(data) {
        if (data) {
            this.element.setAttribute("disabled","disabled")
        }else{
            this.element.removeAttribute("disabled");
        }
    }
}

export default exDisabled;