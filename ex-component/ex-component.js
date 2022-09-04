import elementAttributeManager from "./helpers/attributeActivator.js"
import { getComponentContext } from "./helpers/state-helpers.js";
import { context } from "./state/context.js";
class exComponent //extends HTMLElement 
{

    get context() {
        return this._context || getComponentContext(this) || null;
    }
    set context(value) {
        this._context = this._context || value;
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

    // get scope() {
    //     return this.attributeManager.getScope(this);
    // }
    // set scope(value) {
    //     this.attributeManager.setScope(value);
    // }

    // get state() {
    //     return this.attributeManager.getState(this);
    // }
    // set state(value) {
    //     this.attributeManager.setState(value);
    // }

    async connectedCallback() {
        await this.attributeManager.connectedCallback(this);
    }

    disconnectedCallback() {
        this.attributeManager.disconnectedCallback(this);
    }

    static InheritFrom(classDef) {
        Object.getOwnPropertyNames(exComponent.prototype).
            filter(x => x !== "constructor").
            forEach(x => Object.defineProperty(classDef.prototype, x, Object.getOwnPropertyDescriptor(exComponent.prototype, x)));
        return classDef;
    }
}



export default exComponent;