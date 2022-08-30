import exAttribute from "./ex-attribute.js";

class exModifierAttribute extends exAttribute {
    #boundPaths = new Set();
    #boundPathObservable = null;
    #boundPathSubscription = null;
    constructor(element, binding) {
        super(element)
        this.binding = binding;
    }

    disconnectedCallback() {
        this.#boundPathSubscription.unsubscribe();
    }

    dataCallback(data) {
    }

    #onDataChanged(){
        this.dataCallback(this.getData(this.element.state.state));
    }

    connectedCallback(stateManager) {
        let pathFunc = stateManager.GetAccessedPaths();
        let boundValue = getData(stateManager.state);
        let paths = pathFunc();
        paths.forEach(path => {
            path.split(".").
                map((x, index, ar) => `${ar.filter((a, b) => b < index).join(".")}${index ? "." : ""}${x}`).
                forEach(pathSegment => this.#boundPaths.add(pathSegment))
        });
        this.dataCallback(boundValue);
        this.#boundPathObservable = stateManager.changedObservable.pipe(filter(path=>this.#boundPaths.has(path)));
        this.#boundPathSubscription = this.#boundPathObservable.subscribe(this.#onDataChanged);
    }

    getData(state) {
        return Function(`return ${this.binding}`)();
    }
}

export default exModifierAttribute;