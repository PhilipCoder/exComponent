import exEventAttribute from "../ex-component/ex-event-attribute.js";

class exOn extends exEventAttribute {
    #events = [];
    connectedCallback() {
        let eventObj = Function(`return ${this.binding}`)();
        for (let key in eventObj) {
            this.#events.push(this.element.addEventListener(key, () => { this.runEvent(eventObj[key]) }));
        }
    }

    disconnectedCallback() {
        //this.#events.forEach(x=>this.element.removeEventListener(x));
    }
}

export default exOn;