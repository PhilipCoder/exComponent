function buildQuery(userQuery){
    var query = [];
    for (var key in userQuery) {
        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(userQuery[key]));
    }
    return (query.length ? '?' + query.join('&') : '');
}


function PostRequest(url, method, queryParameters, parameterObj, headers) {
    headers['Content-Type'] = 'application/json';
    let body = {};
    for (let key in parameterObj) {
        body = parameterObj[key];
    }
    url += buildQuery(queryParameters);
    return fetch(url, {
        method: method,
        mode: 'cors',
        body: JSON.stringify(body),
        headers: new Headers(headers)
    })
};

function GetRequest(url, method, parameters, headers) {
    headers['Content-Type'] = 'application/json';
    url += buildQuery(parameters);
    return fetch(url, {
        method: method,
        mode: 'cors',
        headers: new Headers(headers)
    });
};

const requestFunction = function (url, httpVerb = "GET") {
    return (queryParameters = {}, bodyParameters = {}, headers = {}) => {
        return new Promise((resolve, reject) => {
            var promiseCall = httpVerb == "POST" || httpVerb == "PUT" || httpVerb == "PATCH" ?
                PostRequest(url, httpVerb, queryParameters, bodyParameters, headers) :
                GetRequest(url, httpVerb, queryParameters, headers);

            promiseCall.then(async response => {
                response = await response.json();
                resolve(response);
            }).catch(error => {
                reject(error);
            });
        });
    };
};

export { requestFunction };