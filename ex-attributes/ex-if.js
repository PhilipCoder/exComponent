import exAttribute from "../ex-attribute/ex-attribute.js";
import detachedElementContainer from "../ex-component/state/detached-element-container.js";

class exIf extends exAttribute {
    /**@type {HTMLElement} */
    #parentNode = null
    static Priority = 2;
    #toInsert = null;
    #element = null;
    #originalElement = null;
    disconnectedCallback() {
    }

    onConnected(){
        this.#parentNode = this.element.parentElement;
        this.element.removeAttribute("ex-if");
        this.#toInsert = this.element.cloneNode(true);
        this.#element = this.element;
        this.#originalElement = this.element.cloneNode(true);
        detachedElementContainer.addElement(this.element.parentElement, this);
    }


    dataCallback(data) {
        let shouldAttach = !!data;
        if (detachedElementContainer.isAttached(this.#element) && !shouldAttach) {
            detachedElementContainer.detach(this.#element, `Removed by: ${this.tagName}; Expression: ${this.binding}`);
        } else if (!detachedElementContainer.isAttached(this.#element)  && shouldAttach) {
            this.#toInsert = this.#originalElement.cloneNode(true);
            detachedElementContainer.attachReplacement(this.#element, this.#toInsert);
            this.#element = this.#toInsert;
        }

    }
}

export default exIf;