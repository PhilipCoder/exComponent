import exAttribute from "../../framework/base/ex-attribute.js";
import { scope } from "../../framework/state-engine/scope.js";
import detachedElementContainer from "../../framework/dom/detached-element-container.js";

class exLoop extends exAttribute {
    #duplicatedItems = [];
    #originalElement = null;
    #toDuplicate = null;
    #documentElement = null;
    simpleValue = true;

    /**
     * 
     * @param {string} data 
     * @returns 
     */
    dataCallback(data) {
        data = data.trim();
        if (data.indexOf(" ") < 0) throw `Invalid expression for loop: ${data}`;
        let expressionParts = data.substring(data.indexOf(" ")).trim().split(" of ");
        if (expressionParts.length != 2) throw `Invalid expression for loop: ${data}`;
        let variableName = expressionParts[0];
        let loopArray = this.scope.$(expressionParts[1])
        if (!this.#originalElement) {
            let childContext = this.scope._target || {};
            childContext[variableName] = {};
            this.element.createScope(true,true);

            this.#originalElement = this.element;
            this.#toDuplicate = this.element.cloneNode(true);
            this.#toDuplicate.removeAttribute("ex-repeat");
            detachedElementContainer.addElement(this.element.parentElement, this);
            this.#documentElement = this.element.parentElement;
            detachedElementContainer.detach(this.element, `Removed by: ${this.tagName}; Expression: ${this.binding}`);
        }
        for (let toRemove of this.#duplicatedItems) {
            this.element.parentElement.removeChild(toRemove);
        }
        this.#duplicatedItems = [];

        if (!Array.isArray(loopArray)) {
            console.log("Loop value is not an array.");
            return;
        }

        for (let index = 0; index < loopArray.length; index++) {
            let loopItem = loopArray[index];
            let toAdd = this.#toDuplicate.cloneNode(true);
            let childContext = this.scope._target || {};
            childContext[variableName] = loopItem;
            toAdd.scope = new scope(childContext);
            this.#documentElement.appendChild(toAdd);
            this.#duplicatedItems.push(toAdd);
        }
    }
}

export default exLoop;