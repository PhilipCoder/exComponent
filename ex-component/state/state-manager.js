import { Subject } from "rxjs";
import deepProxy from "./state-proxy.js";
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
        // const proxyManager = {
        //     get(target, key, receiver) {
        //         const val = Reflect.get(target, key, receiver);
        //         let path = [...this.path, key];
        //         that.accessedObservable.next(path);
        //         if (typeof val === 'object' && val !== null) {
        //             //that.accessedPaths && that.accessedPaths.push([...this.path, key].join('.'));
        //             return this.nest(val)
        //         } else {
        //             that.accessedPaths && that.accessedPaths.push(path.join('.'));
        //             return val
        //         }
        //     },
        //     set(obj, prop, val) {
        //         if (typeof val === 'object' && val !== null) {
        //             value = this.nest(val)
        //         }
        //         obj[prop] = val;
        //         that.changedObservable.next(this.path.join('.'));
        //         return true;
        //     }
        // }
        // return deepProxy(stateObj, proxyManager);//, { path: "state" }
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