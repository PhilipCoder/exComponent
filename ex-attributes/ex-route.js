import exAttribute from "../ex-attribute/ex-attribute.js";
import stateManager from "../ex-component/state/state-manager.js";
import { getHashValues } from "../ex-component/helpers/hashRoute.js";

class exRoute extends exAttribute {
    static Priority = 3;
    #urlChangedEvent = null;
    urlChanged(event) {
        console.log(event.state);
    }

    connectedCallback() {
        let routeValues = getHashValues();
        let stateManagerInstance = new stateManager("route");
        stateManagerInstance.state = { path: routeValues.path };
        this.element.context.addVariable("route", stateManagerInstance);
        let attributeInstance = this;
        window.onpopstate = (event) => {
            let routeValues = getHashValues();
            attributeInstance.context.scopedVariables["route"].state.path = routeValues.path;
        };
    }

    disconnectedCallback() {

    }
}

export default exRoute;