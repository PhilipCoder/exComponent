import exAttribute from "./ex-attribute.js";

class exModifierAttribute extends exAttribute{
     /**
     * 
     * @param {new() => import('./ex-component.js')} element 
     * @param {*} binding 
     */
    constructor(element,binding){
        super(element)
        this.binding = binding;
    }

    connectedCallback(stateManager){
        
    }


    /**
     * @override
     * @param {*} data 
     */
    onDataModifier(data){
    }

    getData(){
        let state = this.element.state.State
        return Function(`return ${this.binding}`)();
    }
}

export default exModifierAttribute;