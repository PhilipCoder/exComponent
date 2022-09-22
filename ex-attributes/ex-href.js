import exAttribute from "../ex-component/ex-attribute.js";

class exHref extends exAttribute {
    dataCallback(data) {
        this.element.href =data
    }
}

export default exHref;