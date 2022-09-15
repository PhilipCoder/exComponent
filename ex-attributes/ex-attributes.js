import exModifierAttribute from "../ex-component/ex-modifier-attribute.js";

class exAttributes extends exModifierAttribute {
    dataCallback(data) {
        for (let key in data){
            this.element.setAttribute(key, data[key]);
        }
    }
}

export default exAttributes;