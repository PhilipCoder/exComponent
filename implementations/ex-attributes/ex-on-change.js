import exAttribute from "../../framework/base/ex-attribute.js";

class exOnChange extends exAttribute{
    init(){
        this.addEvent("change", ()=>{this.runEvent()});
    }
}

export default exOnChange;