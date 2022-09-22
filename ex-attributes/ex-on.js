import exAttribute from "../ex-component/ex-attribute.js";

class exOn extends exAttribute {
    init(){
        let eventObj = Function(`return ${this.binding}`)();
        for (let key in eventObj) {
            this.addEvent(key,  () => { 
                this.runEvent(eventObj[key]) 
            });
        }
    }
}

export default exOn;