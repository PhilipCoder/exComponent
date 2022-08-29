import stateProxy from "./state-proxy.js";
import { Observable, Subject } from "rxjs";
import deepProxy from "./state-proxy.js";


class stateManager {
    //Fields
    #state = null;

    accessedPaths = null
    accessedObservable = new Subject()
    changedObservable = new Subject()
    
    //Properties
    get State(){
        return this.#state || (this.#state = this.getState());
    }
    set State(value){
        this.#state = this.getState(value);
        return true;
    }

    /** Gets a state proxy instance
     * @param {Object} stateObj 
     */
    getState(stateObj = {}) {
        let that = this;
        const proxyManager = {
            get(target, key, receiver) {
                const val = Reflect.get(target, key, receiver);
                that.accessedObservable.next(this.path);
                if (typeof val === 'object' && val !== null) {
                    return this.nest(val)
                } else {
                    that.accessedPaths && that.accessedPaths.push(this.path.join('.'));
                    return val
                }
            },
            set(obj, prop, value) {
                if (typeof val === 'object' && val !== null) {
                    value = this.nest(val)
                }
                obj[prop] = val;
                that.changedObservable.next(this.path.join('.'));
            }
        }
        return deepProxy(stateObj, proxyManager);
    }

    GetAccessedPaths() {
        let accessedPathsResult = [];
        this.accessedPaths = [];
        return () => {
            accessedPathsResult =this.accessedPaths;
            this.accessedPaths = null;
            return accessedPathsResult;
        };
    }

}

export default stateManager;