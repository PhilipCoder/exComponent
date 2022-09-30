import exElementFactory from "../ex-element/ex-element-factory";

class exInclude extends exElementFactory(HTMLDivElement){
    async onConnected() { 
        if (!this.data.path){
            throw 'No path value defined for include.';
        }
        this.loadHTML(this.data.path);
    }
}

export default exInclude;