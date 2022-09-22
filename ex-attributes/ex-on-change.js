import exAttribute from "../ex-component/ex-attribute.js";

class exOnChange extends exAttribute{
    init(){
        this.addEvent("change", ()=>{this.runEvent()});
    }
}

export default exOnChange;