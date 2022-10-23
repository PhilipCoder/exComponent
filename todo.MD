State engine needs to change.

A singleton observable, "path monitor trigger" needs to be available. Every proxy layer should subscribe to this observable.
Another singleton observable, "path monitor transmitter" should be available.

When a component/attribute wants to subscribe to changes, a "start" message is sent on the path monitor trigger" observable. Every proxy then starts listing for values accessed. If a
path is accessed, the path will be transmitted on the path monitor transmitter observable.

When the component/attribute has the result of it's binding, a "stop" message be broadcasted to the monitor observable. Proxies should then stop monitoring.