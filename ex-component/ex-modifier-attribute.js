import exAttribute from "./ex-attribute.js";
import { filter } from "rxjs";
class exModifierAttribute extends exAttribute {
    #boundPaths = new Set();
    #boundPathObservable = null;
    #boundPathSubscription = null;

    disconnectedCallback() {
        this.#boundPathSubscription.unsubscribe();
    }

    dataCallback(data) {
    }

    #onDataChanged() {
        this.dataCallback(this.getData(this.element.state.state));
    }

    connectedCallback(stateManager) {
        let pathFunc = stateManager.GetAccessedPaths();
        let boundValue = this.getData(stateManager.state);
        let paths = pathFunc();
        paths.forEach(path => {
            path.split(".").
                map((x, index, ar) => `${ar.filter((a, b) => b < index).join(".")}${index ? "." : ""}${x}`).
                forEach(pathSegment => this.#boundPaths.add(pathSegment))
        });
        this.dataCallback(boundValue);
        this.#boundPathObservable = stateManager.changedObservable.pipe(filter(path => this.#boundPaths.has(path)));
        this.#boundPathSubscription = this.#boundPathObservable.subscribe((data)=>this.#onDataChanged(data));
    }

    getData(state) {
        return Function("state", `return ${this.binding}`)(state);
    }
}

export default exModifierAttribute;