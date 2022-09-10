class _detachedElementContainer {
    detachedElements = new Map();

    addElement(parentElement, element) {
        let elements = [...(this.detachedElements.get(parentElement)) || [], element];
        this.detachedElements.set(parentElement, elements);
    }

    parentDisconnected(element){
        this.detachedElements.get(element)?.forEach(element => {
            element?.disconnectedCallback();
        });
    }
}

const detachedElementContainer = new _detachedElementContainer();

export default detachedElementContainer;