import { proxyConstructorFactory } from "./helpers/proxy-constructor.js"
import observerProxy from "./observerProxy.js";
import { coreCommunicator } from "./core-communicator.js";
import { error } from "../../debug/messages/error.js";

const scopeProxyHandler = {
    get: (target, key, receiver) => {
        let result = key === "_target" && target || target[key];
        return {
            "_target": () => target,
            "$": () => {
                return (expression, scopedValues = {}) => {
                    let keys = Object.getOwnPropertyNames(target);
                    let values = keys.map(x => target[x]);
                    let scopeKeys = Object.getOwnPropertyNames(scopedValues);
                    let scopeValues = scopeKeys.map(x => scopedValues[x]);
                    keys = [...keys, ...scopeKeys];
                    values = [...values, ...scopeValues];
                    return Function(...keys, `return ${expression}`)(...values);
                };
            },
            "observe":  () => {
                return (name) => {
                target[name] = target[name].__isProxy ? target[name] :  new observerProxy(name, target[name]) ;
            }}
        }[key]?.() || target[key];
    },
    set: (target, prop, value, proxyInstance) => {
        if (!{ function: false, object: true }[typeof (value)]) {
            coreCommunicator.debugNotificationObservable.next(new error("Sate", `Invalid value assigned to execution context. Type ${value} not supported.`));
            return false;
        }
        target[prop] = value;
        return true;
    }
};

const getScopeObj = (parentScope) => {
    return parentScope ?? {};
}

const scope = proxyConstructorFactory((parentScope) => new Proxy(getScopeObj(parentScope), scopeProxyHandler));
export { scope };