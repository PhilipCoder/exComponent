import exAttribute from "./ex-attribute.js";

class exModifierAttribute extends exAttribute{
    constructor(binding){
        super()
        this.binding = binding;
    }

    /**
     * @override
     * @param {*} data 
     */
    onDataModifier(data){

    }

    getData(){
        let state = this.element.state;
        return Function(`return ${this.binding}`)();
    }
}

export default exModifierAttribute;