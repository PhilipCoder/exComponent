import { filter } from "rxjs";
import { coreCommunicator } from "../state-engine/core-communicator.js";

class exAttribute {
    #boundPaths = new Set();
    #events = [];
    #boundPathObservable = null;
    #boundPathSubscription = null;
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


    get scope() {
        return this.element.scope;
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

    unbindEvents() {
        for (let eventItem of this.#events) {
            this.element.removeEventListener(eventItem.eventName, eventItem.eventFunction);
        }
    }

    //Events
    addEvent(eventName, eventFunction) {
        this.#events.push({ eventName, eventFunction });
        this.element.addEventListener(eventName, eventFunction);
    }

    runEvent(binding = this.binding) {
        this.scope.$(binding);
    }

    //bound attributes
    unbindAttribute() {
        this.#boundPathSubscription?.unsubscribe();
    }

    // dataCallback(data) {
    // }

    #onDataChanged() {
        this.dataCallback(this.getData());
    }

    unsubscribe() {
        this.#boundPathSubscription?.unsubscribe();
    }

    bindElement() {
        coreCommunicator.pathMonitoringIndicator = true;
        let monitorSubscription = coreCommunicator.pathAccessedObservable.subscribe((path)=>{
            this.#boundPaths.add(path);
        });
        let boundValue = this.getData();
        coreCommunicator.pathMonitoringIndicator = false;
        monitorSubscription.unsubscribe();

        this.dataCallback(boundValue);
   
        this.#boundPathObservable = coreCommunicator.pathChangedObservable.pipe(filter(path => this.#boundPaths.has(path)));

        this.#boundPathSubscription = this.#boundPathObservable.subscribe((data) => this.#onDataChanged(data));
        this.afterConnected && this.afterConnected();
    }

    getData() {
        return this.simpleValue ? this.binding : this.scope.$(this.binding);
    }

}

export default exAttribute;