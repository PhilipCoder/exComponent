import exAttribute from "../ex-attribute/ex-attribute.js";
import detachedElementContainer from "../ex-component/state/detached-element-container.js";

class exIf extends exAttribute {
    static Priority = 2;
    #toInsert = null;
    #element = null;
    #originalElement = null;
    disconnectedCallback() {
    }

    onConnected(){
        this.element.removeAttribute("ex-if");
        this.#toInsert = this.element.cloneNode(true);
        this.#element = this.element;
        this.#originalElement = this.element.cloneNode(true);
        this.element.DOM.persistInstance();
    }

    dataCallback(data) {
        let shouldAttach = !!data;
        if (this.#element.DOM.isAttached() && !shouldAttach) {
            this.#element.DOM.detach(`Removed by: ${this.tagName}; Expression: ${this.binding}`);
        } else if (!this.#element.DOM.isAttached()  && shouldAttach) {
            this.#toInsert = this.#originalElement.cloneNode(true);
            this.#element.DOM.attachReplacement(this.#toInsert);
            this.#element = this.#toInsert;
        }
    }
}

export default exIf;