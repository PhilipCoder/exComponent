import exAttribute from "./ex-attribute.js";
import stateManager from "./state/state-manager.js";
import { filter } from "rxjs";
class exModifierAttribute extends exAttribute {
    #boundPaths = new Set();
    #boundPathObservables = [];
    #boundPathSubscriptions = [];

    disconnectedCallback() {
        this.#boundPathSubscriptions.forEach(x=>x.unsubscribe());
    }

    dataCallback(data) {
    }

    #onDataChanged() {
        this.dataCallback(this.getData());
    }

    connectedCallback() {
        let stateManagers = this.context.getOfType(stateManager);
        let pathFuncs = stateManagers.map(x => ({ stateManager: x, paths: x.GetAccessedPaths() }));
        let boundValue = this.getData();
        
        let paths = [];
        pathFuncs.forEach(x => x.paths = x.paths());
        pathFuncs.forEach(x => x.paths.forEach(y => paths.push(y)));
        paths.forEach(path => {
            path.split(".").
                map((x, index, ar) => `${ar.filter((a, b) => b < index).join(".")}${index ? "." : ""}${x}`).
                forEach(pathSegment => this.#boundPaths.add(pathSegment))
        });
        this.dataCallback(boundValue);
        pathFuncs = pathFuncs.filter(x => x.paths.length > 0);
        this.#boundPathObservables = pathFuncs.map(x =>
            x.stateManager.changedObservable.pipe(filter(path => this.#boundPaths.has(path)))
        );
        this.#boundPathSubscriptions = this.#boundPathObservables.map(x=>x.subscribe((data) => this.#onDataChanged(data)));
    }

    getData() {
        return this.context.executeScopedExpression(this.binding);
    }
}

export default exModifierAttribute;