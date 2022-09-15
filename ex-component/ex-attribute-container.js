import attributeContainer from "./state/attribute-container.js";

export default new Proxy({
}, {
    set: (target, key, newValue) => {
        attributeContainer.registerAttribute(key, newValue);
    }
});