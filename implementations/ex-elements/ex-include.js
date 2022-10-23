import exElementFactory from "../../framework/base/elementFactory.js";

class exInclude extends exElementFactory(HTMLDivElement){
    async onConnected() { 
        if (!this.data.path){
            throw 'No path value defined for include.';
        }
        this.loadHTML(this.data.path);
    }
}

export default exInclude;