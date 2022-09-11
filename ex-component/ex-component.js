import elementAttributeManager from "./helpers/attributeActivator.js"
import { getComponentContext } from "./helpers/state-helpers.js";
import { context } from "./state/context.js";
import detachedElementContainer from "./state/detached-element-container.js";
class exComponent  
{

    get context() {
        this._context = this._context || getComponentContext(this);
        return this._context
    }
    set context(value) {
        this._context =  value;
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

    createContext() {
        if (!this._context) {
            let parentScope = this.context?.scopedVariables || [];
            this._context = new context(parentScope);
        }
    }

    async connectedCallback() {
        await this.attributeManager.connectedCallback(this);
    }

    disconnectedCallback() {
        this.attributeManager.disconnectedCallback(this);
        detachedElementContainer.parentDisconnected(this);
    }

    static InheritFrom(classDef) {
        Object.getOwnPropertyNames(exComponent.prototype).
            filter(x => x !== "constructor").
            forEach(x => Object.defineProperty(classDef.prototype, x, Object.getOwnPropertyDescriptor(exComponent.prototype, x)));
        return classDef;
    }
}



export default exComponent;