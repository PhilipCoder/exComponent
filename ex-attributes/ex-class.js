import exModifierAttribute from "../ex-component/ex-modifier-attribute.js";

class exClass extends exModifierAttribute {
    dataCallback(data) {
        for (let className in data){

            (data[className] && this.element.classList.add(className)) || (!data[className] && this.element.classList.remove(className));
        }
    }
}

export default exClass;