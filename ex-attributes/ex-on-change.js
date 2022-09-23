import exAttribute from "../ex-attribute/ex-attribute.js";

class exOnChange extends exAttribute{
    init(){
        this.addEvent("change", ()=>{this.runEvent()});
    }
}

export default exOnChange;