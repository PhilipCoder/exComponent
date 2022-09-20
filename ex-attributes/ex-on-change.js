import exEventAttribute from "../ex-component/ex-event-attribute.js";

class exOnChange extends exEventAttribute{
    init(){
        this.addEvent("change", ()=>{this.runEvent()});
    }
}

export default exOnChange;