class _connectedQueue {
    stack = [];
    currentPromise = null;
    addElement(element) {
        this.stack.push(element);
        this.loadNext();
    }

    loadNext() {
        if (!this.currentPromise && this.stack.length > 0) {
            this.currentPromise = this.stack[0].load();
            this.currentPromise.then(() => {
                this.stack.shift();
                this.currentPromise = null;
                this.loadNext();
            });
        }
    }
};

const connectedQueue = new _connectedQueue();

export { connectedQueue };
