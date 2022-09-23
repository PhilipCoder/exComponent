import exAttribute from "../ex-attribute/ex-attribute.js";

class exHref extends exAttribute {
    dataCallback(data) {
        this.element.href =data
    }
}

export default exHref;