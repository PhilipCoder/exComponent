import elementAttributeManager from "./helpers/attributeActivator.js"

class exComponent //extends HTMLElement 
{
    get attributeManager() {
        this._attributeManager = this._attributeManager || new elementAttributeManager();
        return this._attributeManager;
    }

    set attributeManager(value) {
        this._attributeManager = value;
    }

    get scope() {
        return this.attributeManager.getScope(this);
    }
    set scope(value) {
        this.attributeManager.setScope(value);
    }

    get state() {
        return this.attributeManager.getState(this);
    }
    set state(value) {
        this.attributeManager.setState(value);
    }

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