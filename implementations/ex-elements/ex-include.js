import exElement from "../../framework/base/ex-element.js";

class exInclude extends exElement(HTMLDivElement) {
    
    async onConnected() {
        if (!this.data.path) {
            throw 'No path value defined for include.';
        }
        this.loadHTML(this.data.path, this.getRootElement());
    }
}

export default exInclude;