/**
 * @param {Array} array 
 * @param (Function)} keyFunction 
 * @param {Function} valueFunction 
 */
const arrayToObject = (array, keyFunction, valueFunction)=>{
    let result = {};
    array.forEach(x=>{
        result[keyFunction(x)] = valueFunction(x);
    });
    return result;
}

export {arrayToObject};