import exAttribute from "../ex-attribute/ex-attribute.js";
import exScope from "../ex-attributes/ex-scope.js";
import exState from "../ex-attributes/ex-state.js";
import exBind from "../ex-attributes/ex-bind.js";
import exOnClick from "../ex-attributes/ex-on-click";
import exLoop from "../ex-attributes/ex-loop.js";
import exIf from "../ex-attributes/ex-if.js";
import exRoute from "../ex-attributes/ex-route.js";
import exInclude from "../ex-attributes/ex-include.js";
import exModel from "../ex-attributes/ex-model.js";
import exDisabled from "../ex-attributes/ex-disabled.js";
import exClass from "../ex-attributes/ex-class.js";
import exOnBlur from "../ex-attributes/ex-on-blur.js";
import exOnChange from "../ex-attributes/ex-on-change.js";
import exOnDblclick from "../ex-attributes/ex-on-dblclick.js";
import exOnFocus from "../ex-attributes/ex-on-focus.js";
import exOn from "../ex-attributes/ex-on.js";
import exThis from "../ex-attributes/ex-this.js";
import exHide from "../ex-attributes/ex-hide.js";
import exHref from "../ex-attributes/ex-href.js";
import exCheck from "../ex-attributes/ex-checked.js";
import exClearState from "../ex-attributes/ex-clear-scope.js";
import exValue from "../ex-attributes/ex-value.js";


class _attributeRegistry {
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

const attributeRegistry = new _attributeRegistry();
attributeRegistry.registerAttribute("ex-scopes", exScope);
attributeRegistry.registerAttribute("ex-states", exState);
attributeRegistry.registerAttribute("ex-bind", exBind);
attributeRegistry.registerAttribute("ex-on-click", exOnClick);
attributeRegistry.registerAttribute("ex-repeat", exLoop);
attributeRegistry.registerAttribute("ex-if", exIf);
attributeRegistry.registerAttribute("ex-route", exRoute);
attributeRegistry.registerAttribute("ex-include", exInclude);
attributeRegistry.registerAttribute("ex-model", exModel);
attributeRegistry.registerAttribute("ex-disabled", exDisabled);
attributeRegistry.registerAttribute("ex-classes", exClass);
attributeRegistry.registerAttribute("ex-on-blur", exOnBlur);
attributeRegistry.registerAttribute("ex-on-change", exOnChange);
attributeRegistry.registerAttribute("ex-on-dblclick", exOnDblclick);
attributeRegistry.registerAttribute("ex-on-focus", exOnFocus);
attributeRegistry.registerAttribute("ex-on", exOn);
attributeRegistry.registerAttribute("ex-this", exThis);
attributeRegistry.registerAttribute("ex-hide", exHide);
attributeRegistry.registerAttribute("ex-href", exHref);
attributeRegistry.registerAttribute("ex-attributes", exHref);
attributeRegistry.registerAttribute("ex-checked", exCheck);
attributeRegistry.registerAttribute("ex-clear-state", exClearState);
attributeRegistry.registerAttribute("ex-value", exValue);

export default attributeRegistry;