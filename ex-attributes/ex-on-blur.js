import exEventAttribute from "../ex-component/ex-event-attribute.js";

class exOnBlur extends exEventAttribute{
    init(){
        this.addEvent("blur", ()=>{this.runEvent()});
    }
}

export default exOnBlur;