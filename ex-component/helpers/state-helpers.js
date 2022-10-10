/**
 * @param {HTMLElement} element 
 */
const getComponentContext = (element) => {
    while (element.parentElement != null) {
        element = element.parentElement
        if (element.context != null) return element.context;
    }
    return null;
}

export { getComponentContext };