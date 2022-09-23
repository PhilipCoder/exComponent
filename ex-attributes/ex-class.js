import exAttribute from "../ex-attribute/ex-attribute.js";

class exClass extends exAttribute {
    dataCallback(data) {
        for (let className in data){

            (data[className] && this.element.classList.add(className)) || (!data[className] && this.element.classList.remove(className));
        }
    }
}

export default exClass;