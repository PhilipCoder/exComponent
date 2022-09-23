import exAttribute from "../ex-attribute/ex-attribute.js";

class exBind extends exAttribute {
    dataCallback(data) {
        this.element.innerHTML = data;
    }
}

export default exBind;