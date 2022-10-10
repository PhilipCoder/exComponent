import exElementFactory from "../ex-element/ex-element-factory";
import { requestFunction } from "../ex-component/helpers/request";

class exRequest extends exElementFactory(HTMLDivElement) {
    clearInnerHTML = true;
    async onConnected() {
        this.style.display = "none";
        if (!this.data.path) {
            throw 'No path value defined for request.';
        }
        if (!this.data.result) {
            throw 'No result target defined for request.';
        }
        let request = requestFunction(this.data.path, this.data.verb);
        if (this.data.func) this.context.executeScopedStatement(`${this.data.func} = request`, { request })
        request(this.data.query, this.data.body, this.data.headers).
            then((data) => {
                this.data.result && this.data.result(data);
                this.innerHTML = this.removedHTML;
            });
    }
}

export default exRequest;