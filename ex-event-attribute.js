import exAttribute from "./ex-attribute.js";

class exEventAttribute extends exAttribute {
    /**
     * 
     * @param {new() => import('./ex-component.js')} element 
     * @param {*} binding 
     */
    constructor(element, binding) {
        super(element)
        this.binding = binding;
    }
}

export default exEventAttribute;