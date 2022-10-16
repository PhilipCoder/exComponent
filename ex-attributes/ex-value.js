import exAttribute from "../ex-attribute/ex-attribute.js";

let proxyIdSymbol = Symbol.for("proxyIdSymbol");
class exValue extends exAttribute {
    dataCallback(data) {
        this.element._value = data;
        data = data && typeof (data) === "object" && data[proxyIdSymbol] ? data[proxyIdSymbol] : data;
        this.element.value = data;
        this.element.parentElement?.refreshModel?.();
    }
}

export default exValue;