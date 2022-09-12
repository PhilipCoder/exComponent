import { Subject } from "rxjs";
import observableProxy from "./observerProxy.js";

class stateManager {
    name = ""
    constructor(name) {
        this.name = name;
    }
    //Fields
    boundProp = "state"
    #state = null;
    #getAccessedPaths = null;
    #resetPaths = null;

    accessedPaths = null
    accessedObservable = new Subject()
    changedObservable = new Subject()

    //Properties
    get state() {
        return this.#state || (this.#state = this.getState());
    }
    set state(value) {
        this.#state = this.getState(value);
        return true;
    }

    /** Gets a state proxy instance
     * @param {Object} stateObj 
     */
    getState(stateObj = {}) {
        let that = this;
        if (this.#state) {
            Object.keys(this.#state).forEach(x => that.changedObservable.next(x));
        }
        const valueSet = (path)=>{
            that.changedObservable.next(path);
        };
        let proxyResult = observableProxy(this.name, stateObj, valueSet);
        this.#getAccessedPaths = proxyResult.getLastPathAccessed;
        this.#resetPaths = proxyResult.resetPaths;
        return proxyResult.proxy;
    }

    GetAccessedPaths() {
        this.#resetPaths();
        return () => {
            return this.#getAccessedPaths();
        };
    }

}

export default stateManager;