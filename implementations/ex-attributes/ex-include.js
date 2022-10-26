import exAttribute from "../../framework/base/ex-attribute.js";

class exInclude extends exAttribute {
    async onConnected() {
        const htmlRequest = new Request(this.binding); 
        const response = await fetch(htmlRequest);
        if (response.ok){
            let html = await response.text();
            this.element.getRootElement().innerHTML = html;
        }
    }
}

export default exInclude;