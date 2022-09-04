const myScope = async ({ state }) => {
    return {
        alertMe: () => {
            state.person.peronalDetails.name = state.person.peronalDetails.name + "schoeman";
        }

    };
};

export default myScope;