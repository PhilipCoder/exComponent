import stateManager from "../ex-component/state/state-manager.js"
import { filter } from "rxjs";

class exAttribute {
    #boundPaths = new Set();
    #events = [];
    #boundPathObservables = [];
    #boundPathSubscriptions = [];
    tagName = "";
    simpleValue = false;

    /** Instance of the HTML element the attribute is bound to.
     * @type{HTMLElement} 
     * */
    element = null
    /** Indicates the order the attributes are executed.
     * Higher values will execute first
     */
    static Priority = 0;

    /**Constructor, should not be over be called in inherited classes*/
    constructor(element, binding) {
        this.element = element;
        this.binding = binding;
        this.onConstructed?.();
    }


    get context() {
        return this.element.context;
    }

    connectedCallback() {
        this.onConnected?.();
        this.init?.();
        this.dataCallback && this.bindElement();
    }

    disconnectedCallback() {
        this.onDisconnected?.();
        this.onLoad?.();
        this.dataCallback && this.unbindAttribute();
        this.unbindEvents();
    }

    unbindEvents(){
        for (let eventItem of this.#events){
            this.element.removeEventListener(eventItem.eventName, eventItem.eventFunction);
        }
    }

    //Events
    addEvent(eventName, eventFunction) {
        this.#events.push({ eventName, eventFunction });
        this.element.addEventListener(eventName, eventFunction);
    }

    runEvent(binding = this.binding) {
        this.context.executeScopedExpression(binding);
    }

    //bound attributes
    unbindAttribute() {
        this.#boundPathSubscriptions.forEach(x=>x.unsubscribe());
    }

    // dataCallback(data) {
    // }

    #onDataChanged() {
        this.dataCallback(this.getData());
    }

    unsubscribe(){
        this.#boundPathSubscriptions.forEach(x=>x.unsubscribe());
    }

    bindElement() {
        let stateManagers = this.context.getOfType(stateManager);
        let pathFuncs = stateManagers.map(x => ({ stateManager: x, paths: x.GetAccessedPaths() }));
        let boundValue = this.getData();
        
        let paths = [];
        pathFuncs.forEach(x => x.paths = x.paths());
        pathFuncs.forEach(x => x.paths.forEach(y => paths.push(y)));
        paths.forEach(path => {
            path.split(".").
                map((x, index, ar) => `${ar.filter((a, b) => b < index).join(".")}${index ? "." : ""}${x}`).
                forEach(pathSegment => this.#boundPaths.add(pathSegment))
        });
        this.dataCallback(boundValue);
        pathFuncs = pathFuncs.filter(x => x.paths.length > 0);
        this.#boundPathObservables = pathFuncs.map(x =>
            x.stateManager.changedObservable.pipe(filter(path => this.#boundPaths.has(path)))
        );
        this.#boundPathSubscriptions = this.#boundPathObservables.map(x=>x.subscribe((data) => this.#onDataChanged(data)));
        this.afterConnected && this.afterConnected();
    }

    getData() {
        return this.simpleValue ? this.binding : this.context.executeScopedExpression(this.binding);
    }
    
}

export default exAttribute;