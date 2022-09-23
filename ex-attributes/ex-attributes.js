import exAttribute from "../ex-attribute/ex-attribute.js";

class exAttributes extends exAttribute {
    dataCallback(data) {
        for (let key in data){
            this.element.setAttribute(key, data[key]);
        }
    }
}

export default exAttributes;