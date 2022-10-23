const getHashValues = () => {
    let hash = decodeURI(window.location.hash);
    hash = hash.substring(1);
    let hashParameters = hash.includes("?");
    let path = hashParameters ? hash.substring(0, hash.lastIndexOf("?")) : hash;
    let parameters = {};
    if (hashParameters) {
        let parameters = hash.substring(hash.lastIndexOf("?") + 1);
        parameters = parameters.split("&").reduce((obj, item) => {
            let parts = item.split("=");
            if (parts.length == 2) {
                throw "Invalid parameters";
            }
            return { ...obj, [parts[0]]: parts[1], };
        }, parameters);
    }
    path = path || "/";
    return { path, parameters }
};


export { getHashValues };