import deepProxy from "../state/state-proxy.js";
import { Observable, Subject } from "rxjs";
import stateManager from "../state/state-manager.js";
describe('state-proxy', function () {
  describe('getTrap', function () {
    it('should return -1 when the value is not present', function () {

      let toTest = {
        SessionVariables: {
          Values: [
            { key: "one", value: "hat" },
            { key: "two", value: "shirt" }
          ]
        }
      };

      let accessedPaths = [];

      let testProxy = deepProxy(toTest,
        {
          get(target, key, receiver) {
            const val = Reflect.get(target, key, receiver);
            if (typeof val === 'object' && val !== null) {
              return this.nest(val)
            } else {
              accessedPaths.push(this.path);
              return val
            }
          }, set(obj, prop, value) {
            if (typeof val === 'object' && val !== null) {
              value = this.nest(val)
            }
            obj[prop] = val;
          }
        }
      );

      let secondKey = testProxy.SessionVariables.Values[1].value;


      console.log(secondKey);
      console.log(accessedPaths);

    });
    it('textRx', async () => {
      let toTest = {
        SessionVariables: {
          Values: [
            { key: "one", value: "hat" },
            { key: "two", value: "shirt" }
          ]
        }
      };

      const observable = new Subject();


      let testProxy = deepProxy(toTest,
        {
          get(target, key, receiver) {
            const val = Reflect.get(target, key, receiver);
            observable.next(this.path);
            if (typeof val === 'object' && val !== null) {
              return this.nest(val)
            } else {
              return val
            }
          }, set(obj, prop, value) {
            if (typeof val === 'object' && val !== null) {
              value = this.nest(val)
            }
            obj[prop] = val;
          }
        }
      );

      observable.subscribe((x) => {
        console.log(x);
      })

      let secondKey = testProxy.SessionVariables.Values[1].value;
      let secondKsey = testProxy.SessionVariables.Values[1].value;

    })

    it('textAsync', async () => {
      let toTest = {
        SessionVariables: {
          Values: [
            { key: "one", value: "hat" },
            { key: "two", value: "shirt" }
          ]
        }
      };
      var manager = new stateManager();
      manager.State = toTest;
      let state =  manager.State;

      let accesedPaths = manager.GetAccessedPaths();
      let secondKey = state.SessionVariables.Values[1].value;
      let secondKsey = state.SessionVariables.Values[0].value;

      let result = accesedPaths();

    })
  });
});
