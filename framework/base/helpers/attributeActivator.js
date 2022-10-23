// import { getComponentState, getComponentScope } from "./state-helpers.js";
import { coreCommunicator } from "../../state-engine/core-communicator.js"; 
import { error } from "../../../debug/messages/error.js";
import attributeRegistry from "../../../registry/attribute-registry.js";

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
        let dataAttributes = elementAttributes.filter(x => x.name.startsWith("ex-data-"));

        dataAttributes.forEach(x=>{
            let valueName = x.name.replace("ex-data-","");
            element.data[valueName] = element.dataBindings[valueName] ? x.value : element.scope.$(x.value);
        });
        
        elementAttributes  = elementAttributes.filter(x => !x.name.startsWith("ex-data-"));

        let attributeDefinitions = elementAttributes.
            filter(x => {
                if (attributeRegistry.getAttribute(x.name)) {
                    return true;
                }
                coreCommunicator.debugNotificationObservable.next(new error("Attribute Not Found",`Attribute named ${x.name} is not found!`));
                return false;
            }).
            map(x => { x.attributeDef = attributeRegistry.getAttribute(x.name); return x }).
            sort((a,b)=>b.attributeDef.Priority - a.attributeDef.Priority);

        for (let attributeDef of attributeDefinitions) {
            let attributeInstance = new attributeDef.attributeDef(element, attributeDef.value);
            attributeInstance.tagName = attributeDef.name;
            this.#attributes.push(attributeInstance);

            await attributeInstance.connectedCallback(element.scope);
        }
    }
}

export default elementAttributeManager;