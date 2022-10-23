import { coreCommunicator } from "./core-communicator.js";
import { proxyConstructorFactory } from "./helpers/proxy-constructor.js";

let proxyId = 0;
let proxyIdSymbol = Symbol.for("proxyIdSymbol");
const observableProxyFactory = (name, object) => {
    if (typeof object !== "object") throw "Proxy object should be an object";

    const getHandler = (path, value) => {
        let proxyHandler = {
            get(target, key, receiver) {
                let result = target[key];
                if (typeof (key) === "symbol" || key === "__boundProp") {
                    return result;
                }
                if (key === "__isProxy") {
                    return true;
                }
                coreCommunicator.pathMonitoringIndicator && coreCommunicator.pathAccessedObservable.next(`${path}.${key}`);
                if (typeof result === "object" && result !== null && result.__objectPath === undefined) {
                    result = new Proxy(result, getHandler(`${path}.${key}`, result));
                    target[key] = result;
                    return result;
                }
                if (key === "__objectPath") {
                    return path;
                }
                if (key === "__originalObject") {
                    return target;
                }
                return result;
            },
            set(target, prop, value) {
                value = typeof value === "object" && value !== null && !value.__isProxy ? new Proxy(value.__originalObject ?? value, getHandler(`${path}.${prop}`, value)) : value;
                target[prop] = value;
                coreCommunicator.pathChangedObservable.next(`${path}.${prop}`);
                return true;
            }
        }
        if (typeof value === "object" && value !== null && !value[proxyIdSymbol]) {
            value[proxyIdSymbol] = proxyId++;
        }
        return proxyHandler;
    };
    return new Proxy(object, getHandler(name));
};

export default proxyConstructorFactory(observableProxyFactory);