import exElementFactory from "../ex-element/ex-element-factory";

const requestScopeName = "_requests";

class exRequest extends exElementFactory(HTMLDivElement){
    shouldCreateNewScope = true;
    shouldInheritScope = true;
    #childHTML = "";

    get domLevel(){
        let level = 0;
        let currentNode = this.parentElement;
        while ((!(currentNode instanceof HTMLBodyElement)) && (!(currentNode instanceof HTMLHtmlElement))){
            level++;
        }
        return level;
    }

    async handleInitialLoad(){
        
    }

    async onConnected() { 
        this.scope[requestScopeName] || this.addScopeObject(requestScopeName, this.#getInitialLevelObject());
        this.#childHTML = this.innerHTML;
        this.innerHTML = "";

        if (!this.data.path){
            throw 'No path value defined for include.';
        }
    }

    #getInitialLevelObject(){
        return {
            levelInDom: this.domLevel,
            executionLevel: 0
        };
    }

    

    async #getRequestMethod(){
        let verb = this.data.verb;
        let url = this.data.url;
        let 
        let httpHeaders = 
    }
}