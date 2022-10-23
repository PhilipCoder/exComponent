import exAttribute from "../../framework/base/ex-attribute.js";
class exOnBlur extends exAttribute{
    init(){
        this.addEvent("blur", ()=>{this.runEvent()});
    }
}

export default exOnBlur;