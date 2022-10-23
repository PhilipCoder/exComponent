/**
 * @param {HTMLElement} element 
 */
const getComponentState = (element) => {
    while (element.parentElement != null) {
        element = element.parentElement
        if (element.scope != null) return element.scope;
    }
    return null;
}

export { getComponentState };