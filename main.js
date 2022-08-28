import deepProxy from "./state/state-proxy.js";

let toTest = {
    SessionVariables: {
        Values: [
            { key: "one", value: "hat" },
            { key: "two", value: "shirt" }
        ]
    }
};

let accessedPaths = [];

let testProxy = deepProxy(toTest, {
    get(target, key, receiver) {
        const val = Reflect.get(target, key, receiver);
        if (typeof val === 'object' && val !== null) {
            return this.nest({})
        } else {
            accessedPaths.push(this.path);
            return val
        }
    }
});

console.log(testProxy);