class _detachedElementContainer {
    detachedElements = new Map();
    positionMarkerElements = new Map();

    addElement(parentElement, element) {
        let elements = [...(this.detachedElements.get(parentElement)) || [], element];
        this.detachedElements.set(parentElement, elements);
    }

    parentDisconnected(element) {
        this.detachedElements.get(element)?.forEach(element => {
            element?.disconnectedCallback();
            element.unbindAttribute && element.unbindAttribute();
        });
    }

    detach(element, comment) {
        if (!element.isConnected) return;
        let positionMarker = document.createComment(comment || "Position Marker");
        element.parentElement.insertBefore(positionMarker, element);
        element.parentElement.removeChild(element);
        this.addElement(element);
        this.positionMarkerElements.set(element, positionMarker);
    }

    attach(element) {
        let positionMarker = this.positionMarkerElements.get(element);
        if (element.isConnected || !positionMarker) return;
        positionMarker.parentElement.insertBefore(element, positionMarker);
        positionMarker.parentElement.removeChild(positionMarker);
        this.positionMarkerElements.delete(element);
    }

    attachReplacement(element, replacement) {
        let positionMarker = this.positionMarkerElements.get(element);
        if (element.isConnected || replacement.isConnected || !positionMarker) return;
        positionMarker.parentElement.insertBefore(replacement, positionMarker);
        positionMarker.parentElement.removeChild(positionMarker);
        this.positionMarkerElements.delete(element);
    }

    isAttached(element){
        return !this.positionMarkerElements.get(element);
    }
}

const detachedElementContainer = new _detachedElementContainer();

export default detachedElementContainer;