import elementAttributeManager from "../ex-component/helpers/attributeActivator.js"
import { getComponentContext } from "../ex-component/helpers/state-helpers.js";
import { context } from "../ex-component/state/context.js";
import detachedElementContainer from "../ex-component/state/detached-element-container.js";

const exElementFactory = (baseClass) => {
    return class extends baseClass {
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

        get isAttached(){
            return detachedElementContainer.isAttached(this);
        }

        createContext(newScope) {
            if (!this._context) {
                let parentScope = newScope ? [] : (this.context?.scopedVariables || []);
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

        persistInstance() {
            detachedElementContainer.addElement(this.parentElement, this)
        }

        detach(comment = "Detached Element"){
            detachedElementContainer.detach(this, comment);
        }

        attach(){
            detachedElementContainer.attach(this);
        }

        attachReplacement(replacement){
            detachedElementContainer.attachReplacement(this, replacement);
        }
    }
};

export default exElementFactory;