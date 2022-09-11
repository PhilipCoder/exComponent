import exModifierAttribute from "../ex-component/ex-modifier-attribute.js";
import detachedElementContainer from "../ex-component/state/detached-element-container.js";


function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }

class exIf extends exModifierAttribute {
    /**@type {HTMLElement} */
    #parentNode = null
    #isAttached = true;
    static Priority = 2;
    #elementId = uuidv4();
    #comment = null;
    #toInsert = null;
    #element = null;
    #originalElement = null;
    disconnectedCallback() {
    }


    dataCallback(data) {
        if (!this.#parentNode) {
            this.#parentNode = this.element.parentElement;
            this.element.removeAttribute("ex-if");
            this.#toInsert = this.element.cloneNode(true);
            this.#element = this.element;
            this.#originalElement =  this.element.cloneNode(true);
            detachedElementContainer.addElement(this.element.parentElement, this);
        }
        let shouldAttach = !!data;
        if (this.#isAttached && !shouldAttach) {
         
            this.#comment = document.createComment(this.#elementId);
            this.#parentNode.insertBefore(this.#comment,this.#element);
            this.#parentNode.removeChild(this.#element);
            this.#isAttached = false;
        } else if (!this.#isAttached && shouldAttach) {
            this.#toInsert = this.#originalElement.cloneNode(true);
            this.#parentNode.insertBefore(this.#toInsert,this.#comment);
            this.#parentNode.removeChild(this.#comment);
            this.#element = this.#toInsert;
            this.#isAttached = true;
        }

    }
}

export default exIf;