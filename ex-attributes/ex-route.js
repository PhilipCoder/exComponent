import exAttribute from "../ex-component/ex-attribute.js";
import detachedElementContainer from "../ex-component/state/detached-element-container.js";
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
   //     this.element.createContext();
        this.element.context.addVariable("route", stateManagerInstance);
        let attributeInstance = this;
        window.onpopstate = (event) => {
            let routeValues = getHashValues();
            attributeInstance.context.scopedVariables["route"].state.path = routeValues.path;
        //    attributeInstance.context.executeScopedStatement("route.path = hashPath", { hashPath: routeValues.path })
        };
        // window.addEventListener('locationchange', function () {
        //     console.log('onlocationchange event occurred!');
        // })
        // window.addEventListener('hashchange', function () {
        //     console.log('onhashchange event occurred!');
        // })
    }

    disconnectedCallback() {

    }
}

export default exRoute;