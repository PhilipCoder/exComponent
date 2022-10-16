let proxyId = 0;
let proxyIdSymbol = Symbol.for("proxyIdSymbol");
const observableProxy = (name, object, setCallback) => {
    if (typeof object !== "object") throw "Proxy object should be an object";
    let lastPathAccessed = [];

    const getHandler = (path, value) => {
        let proxyHandler = {
            get(target, key, receiver) {
                let result = target[key];
                if (typeof(key) === "symbol" || key === "__boundProp") {
                    return result;
                }
                lastPathAccessed.push(`${path}.${key}`);
                //  result = result === undefined  ? {} : result;
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
                value = typeof value === "object" && value !== null ? new Proxy(value.__originalObject ?? value, getHandler(`${path}.${prop}`, value)) : value;
                target[prop] = value;
                setCallback(`${path}.${prop}`);
                return true;
            }
        }
        if (typeof value === "object" && value !== null && !value[proxyIdSymbol]) {
            value[proxyIdSymbol] = proxyId++;
        }
        return proxyHandler;
    };
    const resetPaths = () => {
        lastPathAccessed = [];
    };
    const getLastPathAccessed = () => {
        let result = [...lastPathAccessed];
        lastPathAccessed = [];
        return result;
    }
    return { proxy: new Proxy(object, getHandler(name)), getLastPathAccessed, resetPaths }
};

export default observableProxy;