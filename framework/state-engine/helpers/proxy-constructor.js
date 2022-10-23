const proxyConstructorFactory = (factory) => {
    return new Proxy(function () { }, {
        construct: (target, args) => {
            return factory(...args);
        }
    });
};

export { proxyConstructorFactory };