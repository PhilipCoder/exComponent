import exEventAttribute from "../ex-component/ex-event-attribute.js";

class exOnDblclick extends exEventAttribute{
    init(){
        this.addEvent("dblclick", ()=>{this.runEvent()});
    }
}

export default exOnDblclick;