import exModifierAttribute from "../ex-component/ex-modifier-attribute.js";

class exHide extends exModifierAttribute {
    #displayStyle = window.getComputedStyle(this.element).display;
    dataCallback(data) {
        this.element.style.display = data ? (this.#displayStyle === "none" ? "inline-block" : this.#displayStyle) : "none";
    }
}

export default exHide;