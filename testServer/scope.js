const myScope = async ({ state }) => {
    return {
        alertMe: () => {
            state.person.peronalDetails.name = state.person.peronalDetails.name + "schoeman";
        },
        disable:()=>{
            state.disableInput = !state.disableInput;
        }

    };
};

export default myScope;