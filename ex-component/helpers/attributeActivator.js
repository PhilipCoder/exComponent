// import { getComponentState, getComponentScope } from "./state-helpers.js";
import { exceptionLogger } from "./exception-logger.js";
import exModifierAttribute from "../ex-modifier-attribute.js";
import exEventAttribute from "../ex-event-attribute.js";
import attributeContainer from "../state/attribute-container.js";

class elementAttributeManager{

    #eventAttributes = []
    #modifierAttributes = []
    #otherAttributes = []

    disconnectedCallback(element) {
        this.#modifierAttributes.forEach(x => x.disconnectedCallback());
        this.#eventAttributes.forEach(x => x.disconnectedCallback());
        this.#otherAttributes.forEach(x => x.disconnectedCallback());
    }

    async connectedCallback(element) {
        let elementAttributes = [...element.attributes].filter(x => x.name.startsWith("ex-")).map(x => ({
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
            let attributeInstance = new attributeDef.attributeDef(element, attributeDef.value);

            attributeInstance instanceof exModifierAttribute ?
            this.#modifierAttributes.push(attributeInstance) :
                attributeInstance instanceof exEventAttribute ?
                this.#eventAttributes.push(attributeInstance) :
                this.#otherAttributes.push(attributeInstance);

            await attributeInstance.connectedCallback(element.context);
        }
    }
}

export default elementAttributeManager;