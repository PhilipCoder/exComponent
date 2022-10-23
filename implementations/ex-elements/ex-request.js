import exElementFactory from "../../framework/base/elementFactory.js";
import { requestFunction } from "../../framework/ui/request.js";

class exRequest extends exElementFactory(HTMLDivElement) {
    isVirtual = true;
    onConnected() {
        this.style.display = "none";
        if (!this.data.path) {
            throw 'No path value defined for request.';
        }
        if (!this.data.result) {
            throw 'No result target defined for request.';
        }
        let request = requestFunction(this.data.path, this.data.verb);
        if (this.data.func) this.state.$(`${this.data.func} = request`, { request });

        return new Promise((resolve, reject) => {
            request(this.data.query, this.data.body, this.data.headers).
                then((data) => {
                    this.data.result && this.data.result(data);
                    resolve();
                });
        });
    }
}

export default exRequest;