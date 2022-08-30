import exAttribute from "./ex-attribute.js";
import exModifierAttribute from "./ex-modifier-attribute.js";
import exEventAttribute from "./ex-event-attribute.js";
import attributeContainer from "./state/attribute-container.js";
import { getComponentState, getComponentScope } from "./helpers/state-helpers.js";
import { exceptionLogger } from "./helpers/exception-logger.js";

class exComponent extends HTMLElement {
    #scope = null;
    #state = null;
    #exAttributeNames = [];
    #eventAttributes = []
    #modifierAttributes = []

  
    get scope() {
        return this.#scope || getComponentScope(this) || exceptionLogger("No scope found!");
    }
    set scope(value) {
        this.#scope = value;
    }
   
    get state() {
        return this.#state || getComponentState(this) || exceptionLogger("No state found!");
    }
    set state(value) {
        this.#state = value;
    }

    constructor() {
        super();
    }

    connectedCallback(){
        this.#activateAttributes();
    }

    #activateAttributes() {
        this.#exAttributeNames = [...this.attributes].filter(x => x.startsWith("ex-"));

        for (let attributeIndex in this.#exAttributeNames) {
            let attributeName = this.#exAttributeNames[attributeIndex];
            let attributeDef = attributeContainer.getAttribute(attributeName);
            if (!attributeDef) {
                console.log(`Attribute named ${attributeName} is not found!`);
                return;
            }
            let attributeInstance = new attributeDef(this);
            if (attributeInstance instanceof exModifierAttribute) {
                this.#modifierAttributes.push(attributeInstance);
                attributeInstance.connectedCallback(this.state);
            } else if (attributeInstance instanceof exEventAttribute) {
                this.#eventAttributes.push(attributeInstance);
            }
        }
    }

    disconnectedCallback() {
        this.#modifierAttributes.forEach(x=>x.disconnectedCallback());
        this.#eventAttributes.forEach(x=>x.disconnectedCallback());
    }
}

export default exComponent;