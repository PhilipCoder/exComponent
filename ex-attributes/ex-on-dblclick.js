import exEventAttribute from "../ex-component/ex-event-attribute.js";

class exOnDblclick extends exEventAttribute{
    connectedCallback(){
        this.element.addEventListener("dblclick", ()=>{this.runEvent()});
    }

    disconnectedCallback(){

    }
}

export default exOnDblclick;