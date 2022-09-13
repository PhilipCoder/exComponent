const observableProxy = (name, object, setCallback) => {
    if (typeof object !== "object") throw "Proxy object should be an object";
    let lastPathAccessed = [];

    const getHandler = (path) => {
        let proxyHandler = {
            get(target, key, receiver) {
                let result = target[key];
                if (key === "__boundProp") {
                    return result;
                }
                lastPathAccessed.push(`${path}.${key}`);
              //  result = result === undefined  ? {} : result;
                if (typeof result === "object" && result.__objectPath === undefined) {
                    result = new Proxy(result, getHandler(`${path}.${key}`));
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
                if (typeof value === "object") {
                    if (value.__originalObject) {
                        throw `State proxy can't be reassigned.`;
                    }
                    value = new Proxy(result, getHandler(`${path}.${prop}`));
                }
                target[prop] = value;
                setCallback(`${path}.${prop}`);
                return true;
            }
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