import exEventAttribute from "../ex-component/ex-event-attribute.js";

class onClick extends exEventAttribute{
    connectedCallback(){
        this.element.addEventListener("click", ()=>{this.runEvent()});
    }

    disconnectedCallback(){

    }
}

export default onClick;