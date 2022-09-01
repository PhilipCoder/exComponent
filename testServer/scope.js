const myScope = async (state) => {
    return {
        alertMe:()=>{
            state.name = state.name+"schoeman";
        }

    };
};

export default myScope;