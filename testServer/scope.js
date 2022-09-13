const myScope = async ({ state }) => {
    return {
        alertMe: () => {
            state.person.peronalDetails.name = state.person.peronalDetails.name + "schoeman";
        },
        disable: () => {
            state.disableInput = !state.disableInput;
        },
        output: (value) => {
            console.log(value);
        },
        focusElement:function(){
            this.focus();
        }

    };
};

export default myScope;