import exAttribute from "../../framework/base/ex-attribute.js";

let proxyIdSymbol = Symbol.for("proxyIdSymbol");
class exModel extends exAttribute {
    dataCallback(data) {
        data ??= '';
        data = data && typeof (data) === "object" && data[proxyIdSymbol] ? data[proxyIdSymbol] : data;
        this.element.value = data;
        this.element.refreshModel = () => {
            this.element.value = data;
        };
    }

    afterConnected() {
        this.element.addEventListener("input", () => {
            this.runEvent()
        });
    }

    runEvent() {
        let value = this.element.tagName.toLowerCase() === "select" ? this.element.selectedOptions[0]?._value : this.element.value ;
        this.scope.$(`${this.binding} = elementValue`, { elementValue: value });
    }
}

export default exModel;