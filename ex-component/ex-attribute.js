class exAttribute {
    boundPaths = {}
    /**@type{HTMLElement} */
    element = null
    static Priority = 0;

    constructor(element, binding) {
        this.element = element;
        this.binding = binding;
    }

    get context() {
        return this.element.context;
    }

    connectedCallback() {

    }

    disconnectedCallback() {

    }
}

export default exAttribute;