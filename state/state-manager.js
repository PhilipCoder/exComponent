import stateProxy from "./state-proxy.js";
import { Observable, Subject } from "rxjs";

class stateManager {
    accessedPaths = null
    accessedObservable = new Subject()
    changedObservable = new Subject()

    constructor() {
        let that = this;
        const proxyManager = {
            get(target, key, receiver) {
                const val = Reflect.get(target, key, receiver);
                that.accessedObservable.next(this.path);
                if (typeof val === 'object' && val !== null) {
                    return this.nest(val)
                } else {
                    that.accessedPaths && that.accessedPaths.push(this.path);
                    return val
                }
            },
            set(obj, prop, value) {
                if (typeof val === 'object' && val !== null) {
                    value = this.nest(val)
                }
                obj[prop] = val;
                that.changedObservable.next(this.path);
            }
        };
    }

    getAccessedPaths() {
        this.accessedPaths = [];
        return new Promise((resolve, reject) => {
            accessedPaths = this.accessedPaths;
            this.accessedPaths = [];
            resolve(accessedPaths);
        });
    }

}