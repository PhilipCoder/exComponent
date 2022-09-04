import exAttribute from "../ex-attributes.js";

class exLoop extends exAttribute {
    #duplicatedItems = [];
    #originalElement = null;
    #toDuplicate = null;
    dataCallback(data) {
        if (!this.#originalElement){
            this.#originalElement = this.element;
            this.#toDuplicate = this.element.cloneNode(true);
            this.#toDuplicate.removeAttribute("ex-loop");
            this.element.style.display = "none";
        }
        if (!Array.isArray(data)){
            console.log("Loop value is not an array.");
            return;
        }

        let jsToRun = ``;
        
    }
}

export default exLoop;