import elementAttributeManager from "../ex-component/helpers/attributeActivator.js"
import { getComponentContext } from "../ex-component/helpers/state-helpers.js";
import { context } from "../ex-component/state/context.js";
import detachedElementContainer from "../ex-component/state/detached-element-container.js";


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
         * Scope object containing the scoped values.
         */
        get scope() {
            return this.context.getScopedVariablesObj();
        };


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
            if (this.shouldCreateNewScope) this.createContext(this.shouldCreateNewScope, this.shouldInheritScope);
            await this.attributeManager.connectedCallback(this);
            await this.onConnected?.();
            if (this.templatePath){
                await this.loadHTML(this.templatePath);
            }
        }

        async loadHTML(url){
            if (url) {
                const response = await fetch(new Request(url));
                if (response.ok){
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
    }
};

export default exElementFactory;