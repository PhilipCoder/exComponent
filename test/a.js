import observableProxy from "../ex-component/state/observerProxy.js";


describe('state-proxy', function () {
  describe('getTrap', function () {
    it('should return -1 when the value is not present', function () {
      let valObj = {
        user: {
          name: "Philip",
          address: {
            lineA: "45 Namso Road",
            lineB: "Pretoria"
          }
        }
      };

      let lineA = valObj.user.address.lineA;

      const valueChanged = (path) => { };

      const proxyA = observableProxy("valObj", valObj, valueChanged).proxy;
      let user = proxyA.user;
      let userOriginal = user.__originalObject;
    });
  });
});
