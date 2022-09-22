import exAttribute from "../ex-component/ex-attribute.js";
class exOnBlur extends exAttribute{
    init(){
        this.addEvent("blur", ()=>{this.runEvent()});
    }
}

export default exOnBlur;