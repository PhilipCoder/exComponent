import exEventAttribute from "../ex-component/ex-event-attribute.js";

class exOnBlur extends exEventAttribute{
    connectedCallback(){
        this.element.addEventListener("blur", ()=>{this.runEvent()});
    }

    disconnectedCallback(){

    }
}

export default exOnBlur;