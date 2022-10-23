/**
 * Error message class.
 */
class error {
    /**
     * Creates an error message
     * @param {string} area 
     * @param {string} message 
     */
    constructor(area, message) {
        this.area = area;
        this.message = message;
    }
    area = null;
    message = null;
}

export { error };