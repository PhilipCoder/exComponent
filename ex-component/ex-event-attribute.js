import exAttribute from "./ex-attribute.js";

class exEventAttribute extends exAttribute {
    events = [];

    addEvent(eventName, eventFunction) {
        this.events.push({ eventName, eventFunction });
        this.element.addEventListener(eventName, eventFunction);
    }

    onDisconnected(){
        for (let eventItem of this.events){
            this.element.removeEventListener(eventItem.eventName, eventItem.eventFunction);
        }
    }

    runEvent(binding = this.binding) {
        this.context.executeScopedExpression(binding);
    }
}

export default exEventAttribute;