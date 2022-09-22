import exAttribute from "../ex-component/ex-attribute.js";

class exHide extends exAttribute {
    #displayStyle = window.getComputedStyle(this.element).display;
    dataCallback(data) {
        this.element.style.display = data ? (this.#displayStyle === "none" ? "inline-block" : this.#displayStyle) : "none";
    }
}

export default exHide;