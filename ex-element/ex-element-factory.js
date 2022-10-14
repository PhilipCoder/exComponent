import elementAttributeManager from "../ex-component/helpers/attributeActivator.js"
import { getComponentContext } from "../ex-component/helpers/state-helpers.js";
import { context } from "../ex-component/state/context.js";
import detachedElementContainer from "../ex-component/state/detached-element-container.js";
import stateManager from "../ex-component/state/state-manager.js";

const exElementFactory = (baseClass = HTMLElement) => {
    return class extends baseClass {
        /**
         * Object containing values assigned via ex-data attributes.
         * @type {object}
         */
        data = {}

        /**
         * Path to the HTML template of the element that should be loaded into the InnerHTML
         */
        templatePath = null

        /**
         * Indicates if the scope should inherit from it's parent, behave as a lexical scope.
         */
        shouldInheritScope = true;
        /**
         * If true a new scope will be created. If shouldInheritScope is true, a new scope will be created with the properties of the parent scope. Else an empty scope will be created.
         */
        shouldCreateNewScope = false;
        /**
        * If set to true, the element will be a virtual element. 
        * Virtual elements are removed from the DOM as soon as they are connected. When the "onConnected" method resolves, the children of the element is added in it's place.
        */
        isVirtual = false;
        /**
         * Scope object containing the scoped values.
         */
        get scope() {
            return this.context.getScopedVariablesObj();
        };

        /** Adds an observable object to the current scope. Object is converted to an observable proxy.
         * @param {String} stateName 
         * @param {Object} stateObj 
         */
        addStateObject(stateName, stateObj) {
            if (typeof stateObj != "object") throw "State should be an object.";
            let stateManagerInstance = new stateManager(stateName);
            stateManagerInstance.state = stateObj;
            this.context.addVariable(stateName, stateManagerInstance);
        }

        /** Adds an object to the current scope.
         * @param {String} scopeName 
         * @param {Object} scopeObject 
         */
        addScopeObject(scopeName, scopeObject) {
            if (typeof scopeObject != "object") throw "State should be an object.";
            this.context.addVariable(scopeName, scopeObject);
        }

        /**
         * Element DOM operations.
         */
        DOM = {
            /**
             * Checks if the element is attached to the DOM
             * @returns true if the element is attached else false;
             */
            isAttached: () => {
                return detachedElementContainer.isAttached(this);
            },
            /**
             * Moves element instance to a container running in the background, allowing the element to run even while detached from the DOM.
             */
            persistInstance: () => {
                detachedElementContainer.addElement(this.parentElement, this)
            },
            /**
             * Removes the element from the DOM and replacing it with a comment. Comment is a bookmark to indicate where the element should be inserted when reattached.
             * @param {String} comment Bookmark comment. Can be anything.
             */
            detach: (comment = "Detached Element") => {
                detachedElementContainer.detach(this, comment);
            },
            /**
             * Attach the element to the DOM replacing the bookmark comment.
             */
            attach: () => {
                detachedElementContainer.attach(this);
            },
            /**
             * Replaces a detached element with another element.
             * @param {HTMLElement} replacement 
             */
            attachReplacement: (replacement) => {
                detachedElementContainer.attachReplacement(this, replacement);
            },
            /**
            * Replaces a detached element with another elements.
            * @param {Array<HTMLElement>} replacements 
            */
            attachReplacements: (replacements) => {
                detachedElementContainer.attachReplacements(this, replacements);
            }
        }

        /**
         *  System event when element attached to DOM 
         * @virtual
         */
        async onConnected() { }

        /**
         * System event when element connected to DOM 
         * DO NOT OVERRIDE. Use onConnected instead.
         * @protected
         */
        async connectedCallback() {
            let originalInnerHtml = this.innerHTML;
            if (this.isVirtual){
                this.innerHTML = "";
            }
            if (this.shouldCreateNewScope) {
                this.createContext(this.shouldCreateNewScope, this.shouldInheritScope);
            };
            await this.attributeManager.connectedCallback(this);
            if (this.isVirtual) this.DOM.detach();
            await this.onConnected?.();
            if (this.templatePath) {
                await this.loadHTML(this.templatePath);
            }
            if (this.isVirtual) {
                this.innerHTML = originalInnerHtml;
                this.DOM.attachReplacements(Array.from(this.children))
            };
        }

        async loadHTML(url) {
            if (url) {
                const response = await fetch(new Request(url));
                if (response.ok) {
                    let html = await response.text();
                    this.innerHTML = html;
                }
            }
        }

        /**
         *  System event when element disconnected from DOM 
         * @virtual
         */
        async onDisconnected() { }

        /**
         * System event when element disconnected to DOM 
         * DO NOT OVERRIDE. Use onDisconnected instead.
         * @protected
         */
        disconnectedCallback() {
            this.onDisconnected?.();
            this.attributeManager.disconnectedCallback(this);
            detachedElementContainer.parentDisconnected(this);
        }

        /** @protected*/
        get context() { return this._context = this._context || getComponentContext(this); }

        /** @protected*/
        set context(value) { this._context = value; }

        /** @protected */
        get attributeManager() { return this._attributeManager = this._attributeManager || new elementAttributeManager(); }

        /** @protected */
        set attributeManager(value) { this._attributeManager = value; }

        /** @protected */
        get hasContext() { return !!this._context; }

        /** @protected */
        createContext(newScope, newInstance) {
            this._context = this._context ?? new context(newScope ? [] : (newInstance ? [...(this.context?.scopedVariables || [])] : (this.context?.scopedVariables || [])));
        }

        #isVirtualElement = false;

    }
};

export default exElementFactory;