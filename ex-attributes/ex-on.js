import exEventAttribute from "../ex-component/ex-event-attribute.js";

class exOn extends exEventAttribute {
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