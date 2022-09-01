import exModifierAttribute from "./ex-modifier-attribute.js";
import exEventAttribute from "./ex-event-attribute.js";
import attributeContainer from "./state/attribute-container.js";
import { getComponentState, getComponentScope } from "./helpers/state-helpers.js";
import { exceptionLogger } from "./helpers/exception-logger.js";

class exComponent extends HTMLElement {
    #scope = null;
    #state = null;
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
        let elementAttributes = [...this.attributes].filter(x => x.name.startsWith("ex-")).map(x => ({
            name: x.name,
            value: x.value
        }));
        let attributeDefinitions = elementAttributes.
            filter(x => {
                if (attributeContainer.getAttribute(x.name)) {
                    return true;
                }
                exceptionLogger.logError(`Attribute named ${x.name} is not found!`);
                return false;
            }).
            map(x => { x.attributeDef = attributeContainer.getAttribute(x.name); return x }).
            sort((a,b)=>b.attributeDef.Priority - a.attributeDef.Priority);

        for (let attributeDef of attributeDefinitions) {
            let attributeInstance = new attributeDef.attributeDef(this, attributeDef.value);

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