import  exComponent  from "../ex-component/ex-component.js";

class exIncludeHtml extends exComponent {
    async onConnected() {
        if (typeof this.src !== "string") throw "Include src not note.";
        const htmlRequest = new Request(this.src); 
        const response = await fetch(htmlRequest);
        if (response.ok){
            let html = await response.text();
            this.innerHTML = html;
        }
    }
}

customElements.define('ex-include', exIncludeHtml);

export default exIncludeHtml;