import exEventAttribute from "../ex-component/ex-event-attribute.js";

class onClick extends exEventAttribute{
    init(){
        this.addEvent("click", ()=>{this.runEvent()});
    }
}

export default onClick;