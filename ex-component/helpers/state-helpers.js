/**
 * @param {HTMLElement} element 
 */
// const getComponentScope = (element) => {
//     while (element.parentElement != null) {
//         element = element.parentElement
//         if (element.scope != null) return element.scope;
//     }
//     return null;
// }

// /**
//  * @param {HTMLElement} element 
//  */
//  const getComponentState = (element) => {
//     while (element.parentElement != null) {
//         element = element.parentElement
//         if (element.state != null) return element.state;
//     }
//     return null;
// }

const getComponentContext = (element) => {
    while (element.parentElement != null) {
        element = element.parentElement
        if (element.context != null) return element.context;
    }
    return null;
}

export { getComponentContext };