/**
 * @param {HTMLElement} element 
 */
const getComponentScope = (element) => {
    while (element.parentElement != null) {
        element = element.parentElement
        if (element.scope != null) return element.scope;
    }
    return null;
}

/**
 * @param {HTMLElement} element 
 */
 const getComponentState = (element) => {
    while (element.parentElement != null) {
        element = element.parentElement
        if (element.State != null) return element.State;
    }
    return null;
}

export { getComponentState, getComponentScope };