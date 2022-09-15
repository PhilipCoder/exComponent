import exAttribute from "../ex-attribute.js";
import exScope from "../../ex-attributes/ex-scope.js";
import exState from "../../ex-attributes/ex-state.js";
import exBind from "../../ex-attributes/ex-bind.js";
import exOnClick from "../../ex-attributes/ex-on-click";
import exLoop from "../../ex-attributes/ex-loop.js";
import exIf from "../../ex-attributes/ex-if.js";
import exRoute from "../../ex-attributes/ex-route.js";
import exInclude from "../../ex-attributes/ex-include.js";
import exModel from "../../ex-attributes/ex-model.js";
import exDisabled from "../../ex-attributes/ex-disabled.js";
import exClass from "../../ex-attributes/ex-class.js";
import exOnBlur from "../../ex-attributes/ex-on-blur.js";
import exOnChange from "../../ex-attributes/ex-on-change.js";
import exOnDblclick from "../../ex-attributes/ex-on-dblclick.js";
import exOnFocus from "../../ex-attributes/ex-on-focus.js";
import exOn from "../../ex-attributes/ex-on.js";
import exThis from "../../ex-attributes/ex-this.js";
import exHide from "../../ex-attributes/ex-hide.js";
import exHref from "../../ex-attributes/ex-href.js";
import exCheck from "../../ex-attributes/ex-checked.js";

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
attributeContainer.registerAttribute("ex-scopes", exScope);
attributeContainer.registerAttribute("ex-states", exState);
attributeContainer.registerAttribute("ex-bind", exBind);
attributeContainer.registerAttribute("ex-on-click", exOnClick);
attributeContainer.registerAttribute("ex-repeat", exLoop);
attributeContainer.registerAttribute("ex-if", exIf);
attributeContainer.registerAttribute("ex-route", exRoute);
attributeContainer.registerAttribute("ex-include", exInclude);
attributeContainer.registerAttribute("ex-model", exModel);
attributeContainer.registerAttribute("ex-disabled", exDisabled);
attributeContainer.registerAttribute("ex-classes", exClass);
attributeContainer.registerAttribute("ex-on-blur", exOnBlur);
attributeContainer.registerAttribute("ex-on-change", exOnChange);
attributeContainer.registerAttribute("ex-on-dblclick", exOnDblclick);
attributeContainer.registerAttribute("ex-on-focus", exOnFocus);
attributeContainer.registerAttribute("ex-on", exOn);
attributeContainer.registerAttribute("ex-this", exThis);
attributeContainer.registerAttribute("ex-hide", exHide);
attributeContainer.registerAttribute("ex-href", exHref);
attributeContainer.registerAttribute("ex-attributes", exHref);
attributeContainer.registerAttribute("ex-checked", exCheck);



export default attributeContainer;