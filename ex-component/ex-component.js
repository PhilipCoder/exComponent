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
    #otherAttributes = []

    get scope() {
        return this.#scope || getComponentScope(this) || null;
    }
    set scope(value) {
        this.#scope = value;
    }

    get state() {
        return this.#state || getComponentState(this) || null;
    }
    set state(value) {
        this.#state = value;
    }

    constructor() {
        super();
    }

    connectedCallback() {
        this.#activateAttributes();
    }

    async #activateAttributes() {
        this.#exAttributeNames = [...this.attributes].map(x=>x.name).filter(x => x.startsWith("ex-"));

        for (let attributeIndex in this.#exAttributeNames) {
            let attributeName = this.#exAttributeNames[attributeIndex];
            let attributeDef = attributeContainer.getAttribute(attributeName);
            if (!attributeDef) {
                console.log(`Attribute named ${attributeName} is not found!`);
                return;
            }
            let attributeValue = this.getAttribute(attributeName);
            let attributeInstance = new attributeDef(this, attributeValue);

            attributeInstance instanceof exModifierAttribute ?
                this.#modifierAttributes.push(attributeInstance) :
            attributeInstance instanceof exEventAttribute ?
                    this.#eventAttributes.push(attributeInstance) :
                    this.#otherAttributes.push(attributeInstance);

            await attributeInstance.connectedCallback(this.state);
        }
    }

    disconnectedCallback() {
        this.#modifierAttributes.forEach(x => x.disconnectedCallback());
        this.#eventAttributes.forEach(x => x.disconnectedCallback());
        this.#otherAttributes.forEach(x => x.disconnectedCallback());
    }
}

export default exComponent;