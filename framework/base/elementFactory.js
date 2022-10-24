import detachedElementContainer from "../dom/detached-element-container.js";
import { getComponentState } from "./helpers/scope-helpers.js";
import { scope } from "../state-engine/scope.js";
import elementAttributeManager from "./helpers/attributeActivator.js"
import { connectedQueue } from "../dom/connected-queue.js";

const elementFactory = (baseClass = HTMLElement) => {
    return class extends baseClass {
        /**
         * Object containing values assigned via ex-data attributes.
         * @type {object}
         */
        data = {}

        /**
         * Indicates if data bindings are simple bindings.
         * @type {object}
         */
        dataBindings = {}

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

        async load(){
            if (!this.isConnected) return;
            this._scope = this._scope  ?? getComponentState(this);
            let originalInnerHtml = this.innerHTML;
            if (this.isVirtual) {
                this.innerHTML = "";
            }
            if (this.shouldCreateNewScope) {
                this.createScope(this.shouldCreateNewScope, this.shouldInheritScope);
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
        /**
         * System event when element connected to DOM 
         * DO NOT OVERRIDE. Use onConnected instead.
         * @protected
         */
        async connectedCallback() {
            connectedQueue.addElement(this);
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
        get scope() { return this._scope = this._scope ?? getComponentState(this); } //fixed

        /** @protected*/
        set scope(value) { this._scope = value; } //fixed

        /** @protected */
        get attributeManager() { return this._attributeManager = this._attributeManager || new elementAttributeManager(); }

        /** @protected */
        set attributeManager(value) { this._attributeManager = value; }

        /** @protected */
        get hasScope() { return !!this._scope; } //fixed

        /** @protected */
        createScope(newScopeObjectInstance, shouldInheritScope, entriesToKeep = {}) {
            this._scope = newScopeObjectInstance ? new scope(shouldInheritScope ? ({ ...(this.scope?._target ?? {}) }) : entriesToKeep) : new scope(this.scope?._target ?? {});
        }
    }
};

export default elementFactory;