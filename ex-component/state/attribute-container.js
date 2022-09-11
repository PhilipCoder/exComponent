import exAttribute from "../ex-attribute.js";
import exScope from "../../ex-attributes/ex-scope.js";
import exState from "../../ex-attributes/ex-state.js";
import exBind from "../../ex-attributes/ex-bind.js";
import exOnClick from "../../ex-attributes/ex-on-click";
import exLoop from "../../ex-attributes/ex-loop.js";
import exIf from "../../ex-attributes/ex-if.js";
import exRoute from "../../ex-attributes/ex-route.js";
import exInclude from "../../ex-attributes/ex-include.js";

class _attributeContainer {
    #registeredAttributes = new Map();
    /**
     * Register an ex attribute for use in the DOM
     * @param {string} attributeName 
     * @param {exAttribute} attributeDefinition 
     */
    registerAttribute(attributeName, attributeDefinition) {
        console.assert(attributeDefinition.prototype instanceof exAttribute, "Attribute should inherit from the exAttribute class");
        console.assert(!this.#registeredAttributes.has(attributeName), `Attribute name ${attributeName} is already registered.`);
        this.#registeredAttributes.set(attributeName, attributeDefinition);
    }


    /**
     * Gets an attribute definition
     * @param {string} attributeName 
     */
    getAttribute(attributeName) {
        return this.#registeredAttributes.get(attributeName);
    }
}

const attributeContainer = new _attributeContainer();
attributeContainer.registerAttribute("ex-scope", exScope);
attributeContainer.registerAttribute("ex-state", exState);
attributeContainer.registerAttribute("ex-bind", exBind);
attributeContainer.registerAttribute("ex-on-click", exOnClick);
attributeContainer.registerAttribute("ex-repeat", exLoop);
attributeContainer.registerAttribute("ex-if", exIf);
attributeContainer.registerAttribute("ex-route", exRoute);
attributeContainer.registerAttribute("ex-include", exInclude);


export default attributeContainer;