import exAttribute from "../ex-component/ex-attribute.js";

class exBind extends exAttribute {
    dataCallback(data) {
        this.element.innerHTML = data;
    }
}

export default exBind;