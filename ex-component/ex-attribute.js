class exAttribute {
    boundPaths = {}
    element = null
    static Priority = 0;
    
    constructor(element, binding) {
        this.element = element;
        this.binding = binding;
    }

    connectedCallback(){

    }

    disconnectedCallback(){

    }
}

export default exAttribute;