import exAttribute from "../../framework/base/ex-attribute.js";
import { getHashValues } from "../../framework/ui/hashRoute.js";

class exRoute extends exAttribute {
    static Priority = 3;
    urlChanged(event) {
        console.log(event.state);
    }

    connectedCallback() {
        let routeValues = getHashValues();
        this.scope.route = { path: routeValues.path };
        this.scope.observe("route");
        window.onpopstate = () => {
            this.scope.route.path = getHashValues().path;
        };
    }

    disconnectedCallback() {

    }
}

export default exRoute;