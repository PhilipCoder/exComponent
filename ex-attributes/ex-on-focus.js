import exEventAttribute from "../ex-component/ex-event-attribute.js";

class exOnFocus extends exEventAttribute{
    connectedCallback(){
        this.element.addEventListener("focus", ()=>{this.runEvent()});
    }

    disconnectedCallback(){

    }
}

export default exOnFocus;