import exAttribute from "../../framework/base/ex-attribute.js";

class onClick extends exAttribute{
    init(){
        this.addEvent("click", ()=>{this.runEvent()});
    }
}

export default onClick;