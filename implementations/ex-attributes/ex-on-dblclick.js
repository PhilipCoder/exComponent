import exAttribute from "../../framework/base/ex-attribute.js";

class exOnDblclick extends exAttribute{
    init(){
        this.addEvent("dblclick", ()=>{this.runEvent()});
    }
}

export default exOnDblclick;