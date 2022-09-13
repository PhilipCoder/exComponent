import exEventAttribute from "../ex-component/ex-event-attribute.js";

class exOnChange extends exEventAttribute{
    connectedCallback(){
        this.element.addEventListener("change", ()=>{this.runEvent()});
    }

    disconnectedCallback(){

    }
}

export default exOnChange;