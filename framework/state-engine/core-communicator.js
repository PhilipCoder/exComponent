import { Subject } from "rxjs";

/**
 * Core communicator object between state proxies and state observers
 */
const coreCommunicator = {
    pathMonitoringIndicator: false,
    pathAccessedObservable: new Subject(),
    pathChangedObservable: new Subject(),
    debugNotificationObservable: new Subject()
};

export { coreCommunicator };