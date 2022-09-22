// import { getComponentState, getComponentScope } from "./state-helpers.js";
import { exceptionLogger } from "./exception-logger.js";
import attributeContainer from "../state/attribute-container.js";

class elementAttributeManager{

    #attributes = []

    disconnectedCallback(element) {
        this.#attributes.forEach(x => x.disconnectedCallback());
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
            attributeInstance.tagName = attributeDef.name;
            this.#attributes.push(attributeInstance);

            await attributeInstance.connectedCallback(element.context);
        }
    }
}

export default elementAttributeManager;