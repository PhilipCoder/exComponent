import elementAttributeManager from "./helpers/attributeActivator.js"
import { getComponentContext } from "./helpers/state-helpers.js";
import { context } from "./state/context.js";
import detachedElementContainer from "./state/detached-element-container.js";
class exComponent extends HTMLElement {
    newContext = false;
    get scope() {
        return this.context.getScopedVariablesObj();
    }

    get context() {
        this._context = this._context || getComponentContext(this);
        return this._context
    }
    set context(value) {
        this._context = value;
    }

    get attributeManager() {
        this._attributeManager = this._attributeManager || new elementAttributeManager();
        return this._attributeManager;
    }

    set attributeManager(value) {
        this._attributeManager = value;
    }

    get hasContext() {
        return !!this._context;
    }

    createContext(newScope) {
        if (!this._context) {
            let parentScope = newScope ? [] : (this.context?.scopedVariables || []);
            this._context = new context(parentScope);
        }
    }

    async connectedCallback() {
        if (this.isConnected) {
            console.log("component");
            this.newContext && this.createContext(this.newContext);
            await this.attributeManager.connectedCallback(this);
            this.onConnected && this.onConnected();
        }
    }

    disconnectedCallback() {
        this.attributeManager.disconnectedCallback(this);
        detachedElementContainer.parentDisconnected(this);
        this.onDisconnected && this.onDisconnected();
    }

}



export default exComponent;