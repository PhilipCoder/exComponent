import exAttribute from "../ex-component/ex-attribute.js";

class exCheck extends exAttribute {
    #lastValue = false;
    dataCallback(data) {
        (!!data) ? this.element.setAttribute("checked", "true") : this.element.removeAttribute("checked");
        this.element.checked = !!data;
        this.#lastValue = (!!data);
    }

    afterConnected() {
        this.element.addEventListener("click", () => {
            this.runEvent()
        });
    }

    runEvent() {
        if ((!!this.element.checked) !== this.#lastValue) {
            this.#lastValue = !!this.element.checked;
            this.context.executeScopedExpression(`${this.binding} = elementValue`, { elementValue: this.#lastValue });
        }
    }
}

export default exCheck;