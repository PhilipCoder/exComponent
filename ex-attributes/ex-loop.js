import exAttribute from "../ex-component/ex-attribute.js";
import { context } from "../ex-component/state/context.js";
import detachedElementContainer from "../ex-component/state/detached-element-container.js";

class exLoop extends exAttribute {
    #duplicatedItems = [];
    #originalElement = null;
    #toDuplicate = null;
    #documentElement = null
 

    dataCallback(data) {
        if (typeof data !== "object") {
            throw `Loop attribute should have object value;`;
        }
        if (Object.keys(data).length != 1) {
            throw `Loop object should have one property`;
        }
        let variableName = Object.keys(data)[0];
        let loopArray = data[variableName];
        if (!this.#originalElement) {
            let childContext = this.element.context?.getScopedVariables() || {};
            childContext[variableName] = {};
            this.element.context = new context(childContext);
            
            this.#originalElement = this.element;
            this.#toDuplicate = this.element.cloneNode(true);
            this.#toDuplicate.removeAttribute("ex-repeat");
            detachedElementContainer.addElement(this.element.parentElement, this);
            this.#documentElement = this.element.parentElement;
            //this.element.parentElement.removeChild(this.element);
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
            let childContext = this.element.context?.getScopedVariables() || {};
            childContext[variableName] = loopItem;
            toAdd.context = new context(childContext);
            this.#documentElement.appendChild(toAdd);
            this.#duplicatedItems.push(toAdd);
        }
    }
}

export default exLoop;