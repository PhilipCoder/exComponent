import exAttribute from "../ex-component/ex-attribute.js";

class exDisabled extends exAttribute {
    dataCallback(data) {
        if (data) {
            this.element.setAttribute("disabled","disabled")
        }else{
            this.element.removeAttribute("disabled");
        }
    }
}

export default exDisabled;