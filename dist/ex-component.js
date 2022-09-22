/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

function isFunction(value) {
    return typeof value === 'function';
}

function createErrorClass(createImpl) {
    var _super = function (instance) {
        Error.call(instance);
        instance.stack = new Error().stack;
    };
    var ctorFunc = createImpl(_super);
    ctorFunc.prototype = Object.create(Error.prototype);
    ctorFunc.prototype.constructor = ctorFunc;
    return ctorFunc;
}

var UnsubscriptionError = createErrorClass(function (_super) {
    return function UnsubscriptionErrorImpl(errors) {
        _super(this);
        this.message = errors
            ? errors.length + " errors occurred during unsubscription:\n" + errors.map(function (err, i) { return i + 1 + ") " + err.toString(); }).join('\n  ')
            : '';
        this.name = 'UnsubscriptionError';
        this.errors = errors;
    };
});

function arrRemove(arr, item) {
    if (arr) {
        var index = arr.indexOf(item);
        0 <= index && arr.splice(index, 1);
    }
}

var Subscription = (function () {
    function Subscription(initialTeardown) {
        this.initialTeardown = initialTeardown;
        this.closed = false;
        this._parentage = null;
        this._finalizers = null;
    }
    Subscription.prototype.unsubscribe = function () {
        var e_1, _a, e_2, _b;
        var errors;
        if (!this.closed) {
            this.closed = true;
            var _parentage = this._parentage;
            if (_parentage) {
                this._parentage = null;
                if (Array.isArray(_parentage)) {
                    try {
                        for (var _parentage_1 = __values(_parentage), _parentage_1_1 = _parentage_1.next(); !_parentage_1_1.done; _parentage_1_1 = _parentage_1.next()) {
                            var parent_1 = _parentage_1_1.value;
                            parent_1.remove(this);
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (_parentage_1_1 && !_parentage_1_1.done && (_a = _parentage_1.return)) _a.call(_parentage_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                }
                else {
                    _parentage.remove(this);
                }
            }
            var initialFinalizer = this.initialTeardown;
            if (isFunction(initialFinalizer)) {
                try {
                    initialFinalizer();
                }
                catch (e) {
                    errors = e instanceof UnsubscriptionError ? e.errors : [e];
                }
            }
            var _finalizers = this._finalizers;
            if (_finalizers) {
                this._finalizers = null;
                try {
                    for (var _finalizers_1 = __values(_finalizers), _finalizers_1_1 = _finalizers_1.next(); !_finalizers_1_1.done; _finalizers_1_1 = _finalizers_1.next()) {
                        var finalizer = _finalizers_1_1.value;
                        try {
                            execFinalizer(finalizer);
                        }
                        catch (err) {
                            errors = errors !== null && errors !== void 0 ? errors : [];
                            if (err instanceof UnsubscriptionError) {
                                errors = __spreadArray(__spreadArray([], __read(errors)), __read(err.errors));
                            }
                            else {
                                errors.push(err);
                            }
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_finalizers_1_1 && !_finalizers_1_1.done && (_b = _finalizers_1.return)) _b.call(_finalizers_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
            if (errors) {
                throw new UnsubscriptionError(errors);
            }
        }
    };
    Subscription.prototype.add = function (teardown) {
        var _a;
        if (teardown && teardown !== this) {
            if (this.closed) {
                execFinalizer(teardown);
            }
            else {
                if (teardown instanceof Subscription) {
                    if (teardown.closed || teardown._hasParent(this)) {
                        return;
                    }
                    teardown._addParent(this);
                }
                (this._finalizers = (_a = this._finalizers) !== null && _a !== void 0 ? _a : []).push(teardown);
            }
        }
    };
    Subscription.prototype._hasParent = function (parent) {
        var _parentage = this._parentage;
        return _parentage === parent || (Array.isArray(_parentage) && _parentage.includes(parent));
    };
    Subscription.prototype._addParent = function (parent) {
        var _parentage = this._parentage;
        this._parentage = Array.isArray(_parentage) ? (_parentage.push(parent), _parentage) : _parentage ? [_parentage, parent] : parent;
    };
    Subscription.prototype._removeParent = function (parent) {
        var _parentage = this._parentage;
        if (_parentage === parent) {
            this._parentage = null;
        }
        else if (Array.isArray(_parentage)) {
            arrRemove(_parentage, parent);
        }
    };
    Subscription.prototype.remove = function (teardown) {
        var _finalizers = this._finalizers;
        _finalizers && arrRemove(_finalizers, teardown);
        if (teardown instanceof Subscription) {
            teardown._removeParent(this);
        }
    };
    Subscription.EMPTY = (function () {
        var empty = new Subscription();
        empty.closed = true;
        return empty;
    })();
    return Subscription;
}());
var EMPTY_SUBSCRIPTION = Subscription.EMPTY;
function isSubscription(value) {
    return (value instanceof Subscription ||
        (value && 'closed' in value && isFunction(value.remove) && isFunction(value.add) && isFunction(value.unsubscribe)));
}
function execFinalizer(finalizer) {
    if (isFunction(finalizer)) {
        finalizer();
    }
    else {
        finalizer.unsubscribe();
    }
}

var config = {
    onUnhandledError: null,
    onStoppedNotification: null,
    Promise: undefined,
    useDeprecatedSynchronousErrorHandling: false,
    useDeprecatedNextContext: false,
};

var timeoutProvider = {
    setTimeout: function (handler, timeout) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var delegate = timeoutProvider.delegate;
        if (delegate === null || delegate === void 0 ? void 0 : delegate.setTimeout) {
            return delegate.setTimeout.apply(delegate, __spreadArray([handler, timeout], __read(args)));
        }
        return setTimeout.apply(void 0, __spreadArray([handler, timeout], __read(args)));
    },
    clearTimeout: function (handle) {
        var delegate = timeoutProvider.delegate;
        return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearTimeout) || clearTimeout)(handle);
    },
    delegate: undefined,
};

function reportUnhandledError(err) {
    timeoutProvider.setTimeout(function () {
        {
            throw err;
        }
    });
}

function noop() { }

var context$1 = null;
function errorContext(cb) {
    if (config.useDeprecatedSynchronousErrorHandling) {
        var isRoot = !context$1;
        if (isRoot) {
            context$1 = { errorThrown: false, error: null };
        }
        cb();
        if (isRoot) {
            var _a = context$1, errorThrown = _a.errorThrown, error = _a.error;
            context$1 = null;
            if (errorThrown) {
                throw error;
            }
        }
    }
    else {
        cb();
    }
}

var Subscriber = (function (_super) {
    __extends(Subscriber, _super);
    function Subscriber(destination) {
        var _this = _super.call(this) || this;
        _this.isStopped = false;
        if (destination) {
            _this.destination = destination;
            if (isSubscription(destination)) {
                destination.add(_this);
            }
        }
        else {
            _this.destination = EMPTY_OBSERVER;
        }
        return _this;
    }
    Subscriber.create = function (next, error, complete) {
        return new SafeSubscriber(next, error, complete);
    };
    Subscriber.prototype.next = function (value) {
        if (this.isStopped) ;
        else {
            this._next(value);
        }
    };
    Subscriber.prototype.error = function (err) {
        if (this.isStopped) ;
        else {
            this.isStopped = true;
            this._error(err);
        }
    };
    Subscriber.prototype.complete = function () {
        if (this.isStopped) ;
        else {
            this.isStopped = true;
            this._complete();
        }
    };
    Subscriber.prototype.unsubscribe = function () {
        if (!this.closed) {
            this.isStopped = true;
            _super.prototype.unsubscribe.call(this);
            this.destination = null;
        }
    };
    Subscriber.prototype._next = function (value) {
        this.destination.next(value);
    };
    Subscriber.prototype._error = function (err) {
        try {
            this.destination.error(err);
        }
        finally {
            this.unsubscribe();
        }
    };
    Subscriber.prototype._complete = function () {
        try {
            this.destination.complete();
        }
        finally {
            this.unsubscribe();
        }
    };
    return Subscriber;
}(Subscription));
var _bind = Function.prototype.bind;
function bind(fn, thisArg) {
    return _bind.call(fn, thisArg);
}
var ConsumerObserver = (function () {
    function ConsumerObserver(partialObserver) {
        this.partialObserver = partialObserver;
    }
    ConsumerObserver.prototype.next = function (value) {
        var partialObserver = this.partialObserver;
        if (partialObserver.next) {
            try {
                partialObserver.next(value);
            }
            catch (error) {
                handleUnhandledError(error);
            }
        }
    };
    ConsumerObserver.prototype.error = function (err) {
        var partialObserver = this.partialObserver;
        if (partialObserver.error) {
            try {
                partialObserver.error(err);
            }
            catch (error) {
                handleUnhandledError(error);
            }
        }
        else {
            handleUnhandledError(err);
        }
    };
    ConsumerObserver.prototype.complete = function () {
        var partialObserver = this.partialObserver;
        if (partialObserver.complete) {
            try {
                partialObserver.complete();
            }
            catch (error) {
                handleUnhandledError(error);
            }
        }
    };
    return ConsumerObserver;
}());
var SafeSubscriber = (function (_super) {
    __extends(SafeSubscriber, _super);
    function SafeSubscriber(observerOrNext, error, complete) {
        var _this = _super.call(this) || this;
        var partialObserver;
        if (isFunction(observerOrNext) || !observerOrNext) {
            partialObserver = {
                next: (observerOrNext !== null && observerOrNext !== void 0 ? observerOrNext : undefined),
                error: error !== null && error !== void 0 ? error : undefined,
                complete: complete !== null && complete !== void 0 ? complete : undefined,
            };
        }
        else {
            var context_1;
            if (_this && config.useDeprecatedNextContext) {
                context_1 = Object.create(observerOrNext);
                context_1.unsubscribe = function () { return _this.unsubscribe(); };
                partialObserver = {
                    next: observerOrNext.next && bind(observerOrNext.next, context_1),
                    error: observerOrNext.error && bind(observerOrNext.error, context_1),
                    complete: observerOrNext.complete && bind(observerOrNext.complete, context_1),
                };
            }
            else {
                partialObserver = observerOrNext;
            }
        }
        _this.destination = new ConsumerObserver(partialObserver);
        return _this;
    }
    return SafeSubscriber;
}(Subscriber));
function handleUnhandledError(error) {
    {
        reportUnhandledError(error);
    }
}
function defaultErrorHandler(err) {
    throw err;
}
var EMPTY_OBSERVER = {
    closed: true,
    next: noop,
    error: defaultErrorHandler,
    complete: noop,
};

var observable = (function () { return (typeof Symbol === 'function' && Symbol.observable) || '@@observable'; })();

function identity(x) {
    return x;
}

function pipeFromArray(fns) {
    if (fns.length === 0) {
        return identity;
    }
    if (fns.length === 1) {
        return fns[0];
    }
    return function piped(input) {
        return fns.reduce(function (prev, fn) { return fn(prev); }, input);
    };
}

var Observable = (function () {
    function Observable(subscribe) {
        if (subscribe) {
            this._subscribe = subscribe;
        }
    }
    Observable.prototype.lift = function (operator) {
        var observable = new Observable();
        observable.source = this;
        observable.operator = operator;
        return observable;
    };
    Observable.prototype.subscribe = function (observerOrNext, error, complete) {
        var _this = this;
        var subscriber = isSubscriber(observerOrNext) ? observerOrNext : new SafeSubscriber(observerOrNext, error, complete);
        errorContext(function () {
            var _a = _this, operator = _a.operator, source = _a.source;
            subscriber.add(operator
                ?
                    operator.call(subscriber, source)
                : source
                    ?
                        _this._subscribe(subscriber)
                    :
                        _this._trySubscribe(subscriber));
        });
        return subscriber;
    };
    Observable.prototype._trySubscribe = function (sink) {
        try {
            return this._subscribe(sink);
        }
        catch (err) {
            sink.error(err);
        }
    };
    Observable.prototype.forEach = function (next, promiseCtor) {
        var _this = this;
        promiseCtor = getPromiseCtor(promiseCtor);
        return new promiseCtor(function (resolve, reject) {
            var subscriber = new SafeSubscriber({
                next: function (value) {
                    try {
                        next(value);
                    }
                    catch (err) {
                        reject(err);
                        subscriber.unsubscribe();
                    }
                },
                error: reject,
                complete: resolve,
            });
            _this.subscribe(subscriber);
        });
    };
    Observable.prototype._subscribe = function (subscriber) {
        var _a;
        return (_a = this.source) === null || _a === void 0 ? void 0 : _a.subscribe(subscriber);
    };
    Observable.prototype[observable] = function () {
        return this;
    };
    Observable.prototype.pipe = function () {
        var operations = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            operations[_i] = arguments[_i];
        }
        return pipeFromArray(operations)(this);
    };
    Observable.prototype.toPromise = function (promiseCtor) {
        var _this = this;
        promiseCtor = getPromiseCtor(promiseCtor);
        return new promiseCtor(function (resolve, reject) {
            var value;
            _this.subscribe(function (x) { return (value = x); }, function (err) { return reject(err); }, function () { return resolve(value); });
        });
    };
    Observable.create = function (subscribe) {
        return new Observable(subscribe);
    };
    return Observable;
}());
function getPromiseCtor(promiseCtor) {
    var _a;
    return (_a = promiseCtor !== null && promiseCtor !== void 0 ? promiseCtor : config.Promise) !== null && _a !== void 0 ? _a : Promise;
}
function isObserver(value) {
    return value && isFunction(value.next) && isFunction(value.error) && isFunction(value.complete);
}
function isSubscriber(value) {
    return (value && value instanceof Subscriber) || (isObserver(value) && isSubscription(value));
}

function hasLift(source) {
    return isFunction(source === null || source === void 0 ? void 0 : source.lift);
}
function operate(init) {
    return function (source) {
        if (hasLift(source)) {
            return source.lift(function (liftedSource) {
                try {
                    return init(liftedSource, this);
                }
                catch (err) {
                    this.error(err);
                }
            });
        }
        throw new TypeError('Unable to lift unknown Observable type');
    };
}

function createOperatorSubscriber(destination, onNext, onComplete, onError, onFinalize) {
    return new OperatorSubscriber(destination, onNext, onComplete, onError, onFinalize);
}
var OperatorSubscriber = (function (_super) {
    __extends(OperatorSubscriber, _super);
    function OperatorSubscriber(destination, onNext, onComplete, onError, onFinalize, shouldUnsubscribe) {
        var _this = _super.call(this, destination) || this;
        _this.onFinalize = onFinalize;
        _this.shouldUnsubscribe = shouldUnsubscribe;
        _this._next = onNext
            ? function (value) {
                try {
                    onNext(value);
                }
                catch (err) {
                    destination.error(err);
                }
            }
            : _super.prototype._next;
        _this._error = onError
            ? function (err) {
                try {
                    onError(err);
                }
                catch (err) {
                    destination.error(err);
                }
                finally {
                    this.unsubscribe();
                }
            }
            : _super.prototype._error;
        _this._complete = onComplete
            ? function () {
                try {
                    onComplete();
                }
                catch (err) {
                    destination.error(err);
                }
                finally {
                    this.unsubscribe();
                }
            }
            : _super.prototype._complete;
        return _this;
    }
    OperatorSubscriber.prototype.unsubscribe = function () {
        var _a;
        if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
            var closed_1 = this.closed;
            _super.prototype.unsubscribe.call(this);
            !closed_1 && ((_a = this.onFinalize) === null || _a === void 0 ? void 0 : _a.call(this));
        }
    };
    return OperatorSubscriber;
}(Subscriber));

var ObjectUnsubscribedError = createErrorClass(function (_super) {
    return function ObjectUnsubscribedErrorImpl() {
        _super(this);
        this.name = 'ObjectUnsubscribedError';
        this.message = 'object unsubscribed';
    };
});

var Subject = (function (_super) {
    __extends(Subject, _super);
    function Subject() {
        var _this = _super.call(this) || this;
        _this.closed = false;
        _this.currentObservers = null;
        _this.observers = [];
        _this.isStopped = false;
        _this.hasError = false;
        _this.thrownError = null;
        return _this;
    }
    Subject.prototype.lift = function (operator) {
        var subject = new AnonymousSubject(this, this);
        subject.operator = operator;
        return subject;
    };
    Subject.prototype._throwIfClosed = function () {
        if (this.closed) {
            throw new ObjectUnsubscribedError();
        }
    };
    Subject.prototype.next = function (value) {
        var _this = this;
        errorContext(function () {
            var e_1, _a;
            _this._throwIfClosed();
            if (!_this.isStopped) {
                if (!_this.currentObservers) {
                    _this.currentObservers = Array.from(_this.observers);
                }
                try {
                    for (var _b = __values(_this.currentObservers), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var observer = _c.value;
                        observer.next(value);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
        });
    };
    Subject.prototype.error = function (err) {
        var _this = this;
        errorContext(function () {
            _this._throwIfClosed();
            if (!_this.isStopped) {
                _this.hasError = _this.isStopped = true;
                _this.thrownError = err;
                var observers = _this.observers;
                while (observers.length) {
                    observers.shift().error(err);
                }
            }
        });
    };
    Subject.prototype.complete = function () {
        var _this = this;
        errorContext(function () {
            _this._throwIfClosed();
            if (!_this.isStopped) {
                _this.isStopped = true;
                var observers = _this.observers;
                while (observers.length) {
                    observers.shift().complete();
                }
            }
        });
    };
    Subject.prototype.unsubscribe = function () {
        this.isStopped = this.closed = true;
        this.observers = this.currentObservers = null;
    };
    Object.defineProperty(Subject.prototype, "observed", {
        get: function () {
            var _a;
            return ((_a = this.observers) === null || _a === void 0 ? void 0 : _a.length) > 0;
        },
        enumerable: false,
        configurable: true
    });
    Subject.prototype._trySubscribe = function (subscriber) {
        this._throwIfClosed();
        return _super.prototype._trySubscribe.call(this, subscriber);
    };
    Subject.prototype._subscribe = function (subscriber) {
        this._throwIfClosed();
        this._checkFinalizedStatuses(subscriber);
        return this._innerSubscribe(subscriber);
    };
    Subject.prototype._innerSubscribe = function (subscriber) {
        var _this = this;
        var _a = this, hasError = _a.hasError, isStopped = _a.isStopped, observers = _a.observers;
        if (hasError || isStopped) {
            return EMPTY_SUBSCRIPTION;
        }
        this.currentObservers = null;
        observers.push(subscriber);
        return new Subscription(function () {
            _this.currentObservers = null;
            arrRemove(observers, subscriber);
        });
    };
    Subject.prototype._checkFinalizedStatuses = function (subscriber) {
        var _a = this, hasError = _a.hasError, thrownError = _a.thrownError, isStopped = _a.isStopped;
        if (hasError) {
            subscriber.error(thrownError);
        }
        else if (isStopped) {
            subscriber.complete();
        }
    };
    Subject.prototype.asObservable = function () {
        var observable = new Observable();
        observable.source = this;
        return observable;
    };
    Subject.create = function (destination, source) {
        return new AnonymousSubject(destination, source);
    };
    return Subject;
}(Observable));
var AnonymousSubject = (function (_super) {
    __extends(AnonymousSubject, _super);
    function AnonymousSubject(destination, source) {
        var _this = _super.call(this) || this;
        _this.destination = destination;
        _this.source = source;
        return _this;
    }
    AnonymousSubject.prototype.next = function (value) {
        var _a, _b;
        (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.next) === null || _b === void 0 ? void 0 : _b.call(_a, value);
    };
    AnonymousSubject.prototype.error = function (err) {
        var _a, _b;
        (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.call(_a, err);
    };
    AnonymousSubject.prototype.complete = function () {
        var _a, _b;
        (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.complete) === null || _b === void 0 ? void 0 : _b.call(_a);
    };
    AnonymousSubject.prototype._subscribe = function (subscriber) {
        var _a, _b;
        return (_b = (_a = this.source) === null || _a === void 0 ? void 0 : _a.subscribe(subscriber)) !== null && _b !== void 0 ? _b : EMPTY_SUBSCRIPTION;
    };
    return AnonymousSubject;
}(Subject));

function filter(predicate, thisArg) {
    return operate(function (source, subscriber) {
        var index = 0;
        source.subscribe(createOperatorSubscriber(subscriber, function (value) { return predicate.call(thisArg, value, index++) && subscriber.next(value); }));
    });
}

const observableProxy = (name, object, setCallback) => {
    if (typeof object !== "object") throw "Proxy object should be an object";
    let lastPathAccessed = [];

    const getHandler = (path) => {
        let proxyHandler = {
            get(target, key, receiver) {
                let result = target[key];
                if (key === "__boundProp") {
                    return result;
                }
                lastPathAccessed.push(`${path}.${key}`);
              //  result = result === undefined  ? {} : result;
                if (typeof result === "object" && result.__objectPath === undefined) {
                    result = new Proxy(result, getHandler(`${path}.${key}`));
                    target[key] = result;
                    return result;
                }
                if (key === "__objectPath") {
                    return path;
                }
                if (key === "__originalObject") {
                    return target;
                }
                return result;
            },
            set(target, prop, value) {
                if (typeof value === "object") {
                    if (value.__originalObject) {
                        throw `State proxy can't be reassigned.`;
                    }
                    value = new Proxy(result, getHandler(`${path}.${prop}`));
                }
                target[prop] = value;
                setCallback(`${path}.${prop}`);
                return true;
            }
        };
        return proxyHandler;
    };
    const resetPaths = () => {
        lastPathAccessed = [];
    };
    const getLastPathAccessed = () => {
        let result = [...lastPathAccessed];
        lastPathAccessed = [];
        return result;
    };
    return { proxy: new Proxy(object, getHandler(name)), getLastPathAccessed, resetPaths }
};

class stateManager {
    name = ""
    constructor(name) {
        this.name = name;
    }
    //Fields
    __boundProp = "state"
    #state = null;
    #getAccessedPaths = null;
    #resetPaths = null;

    accessedPaths = null
    accessedObservable = new Subject()
    changedObservable = new Subject()

    //Properties
    get state() {
        return this.#state || (this.#state = this.getState());
    }
    set state(value) {
        this.#state = this.getState(value);
        return true;
    }

    /** Gets a state proxy instance
     * @param {Object} stateObj 
     */
    getState(stateObj = {}) {
        let that = this;
        if (this.#state) {
            Object.keys(this.#state).forEach(x => that.changedObservable.next(x));
        }
        const valueSet = (path)=>{
            that.changedObservable.next(path);
        };
        let proxyResult = observableProxy(this.name, stateObj, valueSet);
        this.#getAccessedPaths = proxyResult.getLastPathAccessed;
        this.#resetPaths = proxyResult.resetPaths;
        return proxyResult.proxy;
    }

    GetAccessedPaths() {
        this.#resetPaths();
        return () => {
            return this.#getAccessedPaths();
        };
    }

}

class exAttribute {
    #boundPaths = new Set();
    #events = [];
    #boundPathObservables = [];
    #boundPathSubscriptions = [];
    tagName = "";

    /** Instance of the HTML element the attribute is bound to.
     * @type{HTMLElement} 
     * */
    element = null
    /** Indicates the order the attributes are executed.
     * Higher values will execute first
     */
    static Priority = 0;

    /**Constructor, should not be over be called in inherited classes*/
    constructor(element, binding) {
        this.element = element;
        this.binding = binding;
        this.onConstructed?.();
    }


    get context() {
        return this.element.context;
    }

    connectedCallback() {
        this.onConnected?.();
        this.init?.();
        this.dataCallback && this.bindElement();
    }

    disconnectedCallback() {
        this.onDisconnected?.();
        this.onLoad?.();
        this.dataCallback && this.unbindAttribute();
        this.unbindEvents();
    }

    unbindEvents(){
        for (let eventItem of this.#events){
            this.element.removeEventListener(eventItem.eventName, eventItem.eventFunction);
        }
    }

    //Events
    addEvent(eventName, eventFunction) {
        this.#events.push({ eventName, eventFunction });
        this.element.addEventListener(eventName, eventFunction);
    }

    runEvent(binding = this.binding) {
        this.context.executeScopedExpression(binding);
    }

    //bound attributes
    unbindAttribute() {
        this.#boundPathSubscriptions.forEach(x=>x.unsubscribe());
    }

    // dataCallback(data) {
    // }

    #onDataChanged() {
        this.dataCallback(this.getData());
    }

    unsubscribe(){
        this.#boundPathSubscriptions.forEach(x=>x.unsubscribe());
    }

    bindElement() {
        let stateManagers = this.context.getOfType(stateManager);
        let pathFuncs = stateManagers.map(x => ({ stateManager: x, paths: x.GetAccessedPaths() }));
        let boundValue = this.getData();
        
        let paths = [];
        pathFuncs.forEach(x => x.paths = x.paths());
        pathFuncs.forEach(x => x.paths.forEach(y => paths.push(y)));
        paths.forEach(path => {
            path.split(".").
                map((x, index, ar) => `${ar.filter((a, b) => b < index).join(".")}${index ? "." : ""}${x}`).
                forEach(pathSegment => this.#boundPaths.add(pathSegment));
        });
        this.dataCallback(boundValue);
        pathFuncs = pathFuncs.filter(x => x.paths.length > 0);
        this.#boundPathObservables = pathFuncs.map(x =>
            x.stateManager.changedObservable.pipe(filter(path => this.#boundPaths.has(path)))
        );
        this.#boundPathSubscriptions = this.#boundPathObservables.map(x=>x.subscribe((data) => this.#onDataChanged(data)));
        this.afterConnected && this.afterConnected();
    }

    getData() {
        return this.context.executeScopedExpression(this.binding);
    }
    
}

const exceptionLogger = {
    logError: (exception) => {
        throw exception;
    }
};

class exScope extends exAttribute {
    static Priority = 4;
    async connectedCallback() {
        let scopeObj = await Function(`return ${this.binding}`)();
        for (let scopeVarName in scopeObj) {
            let module = await Function(`return import('${scopeObj[scopeVarName]}')`)();
            if (Object.keys(module).length === 0) {
                throw `Module ${this.binding} does not provide any exports`;
            }

            let moduleName = Object.keys(module)[0];
            module = module[moduleName];
            if (!module) {
                throw `Module ${this.binding} has an invalid export`;
            }

            module = await this.getModuleInstance(module);

            this.element.createContext();
            this.element.context.addVariable(scopeVarName, module);
        }
    }

    //Module parameters should be in the following format: ({scope1, scope, state})
    async getModuleInstance(moduleDefinition) {
        if (typeof moduleDefinition === "function") {
            if (moduleDefinition.prototype) {
                return new moduleDefinition(this.context?.getScopedVariablesObj() || {});
            }
            return await moduleDefinition(this.context?.getScopedVariablesObj() || {});
        }
        return moduleDefinition;
    }
}

class exState extends exAttribute {
    static Priority = 5;
    async connectedCallback() {
        let innerHTML = this.element.innerHTML;
        console.log("state");
        this.element.innerHTML = "";
        let scopeObj = await Function(`return ${this.binding}`)();
        this.element.createContext();
        for (let scopeVarName in scopeObj) {
            let module = await Function(`return import('${scopeObj[scopeVarName]}')`)();
            if (Object.keys(module).length === 0) {
                throw `Module ${this.binding} does not provide any exports`;
            }
            let moduleName = Object.keys(module)[0];
            module = module[moduleName];
            if (!module) {
                throw `Module ${this.binding} has an invalid export`;
            }

            module = await this.getModuleInstance(module);

            let stateManagerInstance = new stateManager(scopeVarName);
            stateManagerInstance.state = module;
            this.element.context.addVariable(scopeVarName, stateManagerInstance);
        }
        this.element.innerHTML = innerHTML;
    }

    async getModuleInstance(moduleDefinition) {
        if (typeof moduleDefinition === "function") {
            if (moduleDefinition.prototype) {
                return new moduleDefinition(this.context?.getScopedVariablesObj() || {});
            }
            return await moduleDefinition(this.context?.getScopedVariablesObj() || {});
        }
        return moduleDefinition;
    }
}

class exBind extends exAttribute {
    dataCallback(data) {
        this.element.innerHTML = data;
    }
}

class onClick extends exAttribute{
    init(){
        this.addEvent("click", ()=>{this.runEvent();});
    }
}

/**
 * The context class is the class  that should contain
 */
class context {
    scopedVariables = {};
    constructor(scopedVariables = {}) {
        this.scopedVariables = scopedVariables;
    }
    addVariable(name, value) {
        if (typeof value === "string" || typeof value === "number" || typeof value === "undefined") {
            throw "Invalid context type applied";
        }
        this.scopedVariables[name] = value;
    }

    getVariable(name) {
        return this.scopedVariables[name]
    }

    getScopedVariablesObj() {
        let result = Object.assign({}, this.scopedVariables);
        Object.keys(result).forEach(x => result[x] = result[x].__boundProp ? result[x][result[x].__boundProp] : result[x]);
        return result;
    }

    #getScopedVariables() {
        let scopeNames = Object.keys(this.scopedVariables);
        let scopeValues = Object.keys(this.scopedVariables).map(x => this.scopedVariables[x].__boundProp ? this.scopedVariables[x][this.scopedVariables[x].__boundProp] : this.scopedVariables[x]);
        return { scopeNames, scopeValues };
    }

    executeScopedExpression(expression, parameters = {}) {
        let scopeVars = this.#getScopedVariables();
        Object.keys(parameters).forEach(x => { 
            scopeVars.scopeNames.push(x);
            scopeVars.scopeValues.push(parameters[x]);
         });
        return Function(...scopeVars.scopeNames, `return ${expression}`)(...scopeVars.scopeValues);
    }

    executeScopedStatement(expression, parameters = {}) {
        let scopeVars = this.#getScopedVariables();
        Object.keys(parameters).forEach(x => { 
            scopeVars.scopeNames.push(x);
            scopeVars.scopeValues.push(parameters[x]);
         });
        return Function(...scopeVars.scopeNames, `${expression}`)(...scopeVars.scopeValues);
    }

    getOfType(type) {
        let scopeVars = Object.keys(this.scopedVariables).map(x => this.scopedVariables[x]);
        return scopeVars.filter(x => x instanceof type);
    }

    getScopedVariables() {
        return Object.assign({}, this.scopedVariables);
    }
}

class _detachedElementContainer {
    detachedElements = new Map();
    positionMarkerElements = new Map();

    addElement(parentElement, element) {
        let elements = [...(this.detachedElements.get(parentElement)) || [], element];
        this.detachedElements.set(parentElement, elements);
    }

    parentDisconnected(element) {
        this.detachedElements.get(element)?.forEach(element => {
            element?.disconnectedCallback();
            element.unbindAttribute && element.unbindAttribute();
        });
    }

    detach(element, comment) {
        if (!element.isConnected) return;
        let positionMarker = document.createComment(comment || "Position Marker");
        element.parentElement.insertBefore(positionMarker, element);
        element.parentElement.removeChild(element);
        this.addElement(element);
        this.positionMarkerElements.set(element, positionMarker);
    }

    attach(element) {
        let positionMarker = this.positionMarkerElements.get(element);
        if (element.isConnected || !positionMarker) return;
        positionMarker.parentElement.insertBefore(element, positionMarker);
        positionMarker.parentElement.removeChild(positionMarker);
        this.positionMarkerElements.delete(element);
    }

    attachReplacement(element, replacement) {
        let positionMarker = this.positionMarkerElements.get(element);
        if (element.isConnected || replacement.isConnected || !positionMarker) return;
        positionMarker.parentElement.insertBefore(replacement, positionMarker);
        positionMarker.parentElement.removeChild(positionMarker);
        this.positionMarkerElements.delete(element);
    }

    isAttached(element){
        return !this.positionMarkerElements.get(element);
    }
}

const detachedElementContainer = new _detachedElementContainer();

class exLoop extends exAttribute {
    #duplicatedItems = [];
    #originalElement = null;
    #toDuplicate = null;
    #documentElement = null
 

    dataCallback(data) {
        if (typeof data !== "object") {
            throw `Loop attribute should have object value;`;
        }
        if (Object.keys(data).length != 1) {
            throw `Loop object should have one property`;
        }
        let variableName = Object.keys(data)[0];
        let loopArray = data[variableName];
        if (!this.#originalElement) {
            let childContext = this.element.context?.getScopedVariables() || {};
            childContext[variableName] = {};
            this.element.context = new context(childContext);
            
            this.#originalElement = this.element;
            this.#toDuplicate = this.element.cloneNode(true);
            this.#toDuplicate.removeAttribute("ex-repeat");
            detachedElementContainer.addElement(this.element.parentElement, this);
            this.#documentElement = this.element.parentElement;
            //this.element.parentElement.removeChild(this.element);
            detachedElementContainer.detach(this.element, `Removed by: ${this.tagName}; Expression: ${this.binding}`);
        }
        for (let toRemove of this.#duplicatedItems) {
            this.element.parentElement.removeChild(toRemove);
        }
        this.#duplicatedItems = [];
       
        if (!Array.isArray(loopArray)) {
            console.log("Loop value is not an array.");
            return;
        }

        for (let index = 0; index < loopArray.length; index++) {
            let loopItem = loopArray[index];
            let toAdd = this.#toDuplicate.cloneNode(true);
            let childContext = this.element.context?.getScopedVariables() || {};
            childContext[variableName] = loopItem;
            toAdd.context = new context(childContext);
            this.#documentElement.appendChild(toAdd);
            this.#duplicatedItems.push(toAdd);
        }
    }
}

class exIf extends exAttribute {
    /**@type {HTMLElement} */
    #parentNode = null
    static Priority = 2;
    #toInsert = null;
    #element = null;
    #originalElement = null;
    disconnectedCallback() {
    }

    onConnected(){
        this.#parentNode = this.element.parentElement;
        this.element.removeAttribute("ex-if");
        this.#toInsert = this.element.cloneNode(true);
        this.#element = this.element;
        this.#originalElement = this.element.cloneNode(true);
        detachedElementContainer.addElement(this.element.parentElement, this);
    }


    dataCallback(data) {
        let shouldAttach = !!data;
        if (detachedElementContainer.isAttached(this.#element) && !shouldAttach) {
            detachedElementContainer.detach(this.#element, `Removed by: ${this.tagName}; Expression: ${this.binding}`);
        } else if (!detachedElementContainer.isAttached(this.#element)  && shouldAttach) {
            this.#toInsert = this.#originalElement.cloneNode(true);
            detachedElementContainer.attachReplacement(this.#element, this.#toInsert);
            this.#element = this.#toInsert;
        }

    }
}

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

class exRoute extends exAttribute {
    static Priority = 3;
    #urlChangedEvent = null;
    urlChanged(event) {
        console.log(event.state);
    }

    connectedCallback() {
        let routeValues = getHashValues();
        let stateManagerInstance = new stateManager("route");
        stateManagerInstance.state = { path: routeValues.path };
        this.element.context.addVariable("route", stateManagerInstance);
        let attributeInstance = this;
        window.onpopstate = (event) => {
            let routeValues = getHashValues();
            attributeInstance.context.scopedVariables["route"].state.path = routeValues.path;
        };
    }

    disconnectedCallback() {

    }
}

class exInclude extends exAttribute {
    async connectedCallback() {
        const htmlRequest = new Request(this.binding); 
        const response = await fetch(htmlRequest);
        if (response.ok){
            let html = await response.text();
            this.element.innerHTML = html;
        }
    }
}

class exModel extends exAttribute {
    dataCallback(data) {
        this.element.value = data;
    }

    afterConnected() {
        this.element.addEventListener("input", () => { 
            this.runEvent(); 
        });
    }

    runEvent() {
        this.context.executeScopedExpression(`${this.binding} = elementValue`, { elementValue: this.element.value });
    }
}

class exDisabled extends exAttribute {
    dataCallback(data) {
        if (data) {
            this.element.setAttribute("disabled","disabled");
        }else {
            this.element.removeAttribute("disabled");
        }
    }
}

class exClass extends exAttribute {
    dataCallback(data) {
        for (let className in data){

            (data[className] && this.element.classList.add(className)) || (!data[className] && this.element.classList.remove(className));
        }
    }
}

class exOnBlur extends exAttribute{
    init(){
        this.addEvent("blur", ()=>{this.runEvent();});
    }
}

class exOnChange extends exAttribute{
    init(){
        this.addEvent("change", ()=>{this.runEvent();});
    }
}

class exOnDblclick extends exAttribute{
    init(){
        this.addEvent("dblclick", ()=>{this.runEvent();});
    }
}

class exOnFocus extends exAttribute {
    init() {
        this.addEvent("focus", () => { this.runEvent(); });
    }
}

class exOn extends exAttribute {
    init(){
        let eventObj = Function(`return ${this.binding}`)();
        for (let key in eventObj) {
            this.addEvent(key,  () => { 
                this.runEvent(eventObj[key]); 
            });
        }
    }
}

class exThis extends exAttribute {
    async connectedCallback() {
        this.context.executeScopedStatement(`${this.binding} = ${this.binding}.bind(elm)`, { elm: this.element });
    }
}

class exHide extends exAttribute {
    #displayStyle = window.getComputedStyle(this.element).display;
    dataCallback(data) {
        this.element.style.display = data ? (this.#displayStyle === "none" ? "inline-block" : this.#displayStyle) : "none";
    }
}

class exHref extends exAttribute {
    dataCallback(data) {
        this.element.href =data;
    }
}

class exCheck extends exAttribute {
    #lastValue = false;
    dataCallback(data) {
        (!!data) ? this.element.setAttribute("checked", "true") : this.element.removeAttribute("checked");
        this.element.checked = !!data;
        this.#lastValue = (!!data);
    }

    afterConnected() {
        this.element.addEventListener("click", () => {
            this.runEvent();
        });
    }

    runEvent() {
        if ((!!this.element.checked) !== this.#lastValue) {
            this.#lastValue = !!this.element.checked;
            this.context.executeScopedExpression(`${this.binding} = elementValue`, { elementValue: this.#lastValue });
        }
    }
}

class exClearState extends exAttribute {
    static Priority = 5;
    async connectedCallback() {
        this.element.createContext(true);
    }
}

class _attributeContainer {
    #registeredAttributes = new Map();
    /**
     * Register an ex attribute for use in the DOM
     * @param {string} attributeName 
     * @param {exAttribute} attributeDefinition 
     */
    registerAttribute(attributeName, attributeDefinition) {
        console.assert(attributeDefinition.prototype instanceof exAttribute, "Attribute should inherit from the exAttribute class");
        console.assert(!this.#registeredAttributes.has(attributeName), `Attribute name ${attributeName} is already registered.`);
        this.#registeredAttributes.set(attributeName, attributeDefinition);
    }


    /**
     * Gets an attribute definition
     * @param {string} attributeName 
     */
    getAttribute(attributeName) {
        return this.#registeredAttributes.get(attributeName);
    }
}

const attributeContainer = new _attributeContainer();
attributeContainer.registerAttribute("ex-scopes", exScope);
attributeContainer.registerAttribute("ex-states", exState);
attributeContainer.registerAttribute("ex-bind", exBind);
attributeContainer.registerAttribute("ex-on-click", onClick);
attributeContainer.registerAttribute("ex-repeat", exLoop);
attributeContainer.registerAttribute("ex-if", exIf);
attributeContainer.registerAttribute("ex-route", exRoute);
attributeContainer.registerAttribute("ex-include", exInclude);
attributeContainer.registerAttribute("ex-model", exModel);
attributeContainer.registerAttribute("ex-disabled", exDisabled);
attributeContainer.registerAttribute("ex-classes", exClass);
attributeContainer.registerAttribute("ex-on-blur", exOnBlur);
attributeContainer.registerAttribute("ex-on-change", exOnChange);
attributeContainer.registerAttribute("ex-on-dblclick", exOnDblclick);
attributeContainer.registerAttribute("ex-on-focus", exOnFocus);
attributeContainer.registerAttribute("ex-on", exOn);
attributeContainer.registerAttribute("ex-this", exThis);
attributeContainer.registerAttribute("ex-hide", exHide);
attributeContainer.registerAttribute("ex-href", exHref);
attributeContainer.registerAttribute("ex-attributes", exHref);
attributeContainer.registerAttribute("ex-checked", exCheck);
attributeContainer.registerAttribute("ex-clear-state", exClearState);

// import { getComponentState, getComponentScope } from "./state-helpers.js";

class elementAttributeManager{

    #attributes = []

    disconnectedCallback(element) {
        this.#attributes.forEach(x => x.disconnectedCallback());
    }

    async connectedCallback(element) {
        let elementAttributes = [...element.attributes].filter(x => x.name.startsWith("ex-")).map(x => ({
            name: x.name,
            value: x.value
        }));
        let attributeDefinitions = elementAttributes.
            filter(x => {
                if (attributeContainer.getAttribute(x.name)) {
                    return true;
                }
                exceptionLogger.logError(`Attribute named ${x.name} is not found!`);
                return false;
            }).
            map(x => { x.attributeDef = attributeContainer.getAttribute(x.name); return x }).
            sort((a,b)=>b.attributeDef.Priority - a.attributeDef.Priority);

        for (let attributeDef of attributeDefinitions) {
            let attributeInstance = new attributeDef.attributeDef(element, attributeDef.value);
            attributeInstance.tagName = attributeDef.name;
            this.#attributes.push(attributeInstance);

            await attributeInstance.connectedCallback(element.context);
        }
    }
}

/**
 * @param {HTMLElement} element 
 */
// const getComponentScope = (element) => {
//     while (element.parentElement != null) {
//         element = element.parentElement
//         if (element.scope != null) return element.scope;
//     }
//     return null;
// }

// /**
//  * @param {HTMLElement} element 
//  */
//  const getComponentState = (element) => {
//     while (element.parentElement != null) {
//         element = element.parentElement
//         if (element.state != null) return element.state;
//     }
//     return null;
// }

const getComponentContext = (element) => {
    while (element.parentElement != null) {
        element = element.parentElement;
        if (element.context != null) return element.context;
    }
    return null;
};

class exComponent extends HTMLElement {
    newContext = false;
    get scope() {
        return this.context.getScopedVariablesObj();
    }

    get context() {
        this._context = this._context || getComponentContext(this);
        return this._context
    }
    set context(value) {
        this._context = value;
    }

    get attributeManager() {
        this._attributeManager = this._attributeManager || new elementAttributeManager();
        return this._attributeManager;
    }

    set attributeManager(value) {
        this._attributeManager = value;
    }

    get hasContext() {
        return !!this._context;
    }

    createContext(newScope) {
        if (!this._context) {
            let parentScope = newScope ? [] : (this.context?.scopedVariables || []);
            this._context = new context(parentScope);
        }
    }

    async connectedCallback() {
        if (this.isConnected) {
            console.log("component");
            this.newContext && this.createContext(this.newContext);
            await this.attributeManager.connectedCallback(this);
            this.onConnected && this.onConnected();
        }
    }

    disconnectedCallback() {
        this.attributeManager.disconnectedCallback(this);
        detachedElementContainer.parentDisconnected(this);
        this.onDisconnected && this.onDisconnected();
    }

}

class exIncludeHtml extends exComponent {
    async onConnected() {
        if (typeof this.src !== "string") throw "Include src not note.";
        const htmlRequest = new Request(this.src); 
        const response = await fetch(htmlRequest);
        if (response.ok){
            let html = await response.text();
            this.innerHTML = html;
        }
    }
}

customElements.define('ex-include', exIncludeHtml);

class exElement  
{

    get context() {
        this._context = this._context || getComponentContext(this);
        return this._context
    }
    set context(value) {
        this._context =  value;
    }

    get attributeManager() {
        this._attributeManager = this._attributeManager || new elementAttributeManager();
        return this._attributeManager;
    }

    set attributeManager(value) {
        this._attributeManager = value;
    }

    get hasContext() {
        return !!this._context;
    }

    createContext(newScope) {
        if (!this._context) {
            let parentScope =  newScope ? [] : (this.context?.scopedVariables || []);
            this._context = new context(parentScope);
        }
    }

    async connectedCallback() {
        await this.attributeManager.connectedCallback(this);
    }

    disconnectedCallback() {
        this.attributeManager.disconnectedCallback(this);
        detachedElementContainer.parentDisconnected(this);
    }

    static InheritFrom(classDef) {
        Object.getOwnPropertyNames(exElement.prototype).
            filter(x => x !== "constructor").
            forEach(x => Object.defineProperty(classDef.prototype, x, Object.getOwnPropertyDescriptor(exElement.prototype, x)));
        return classDef;
    }
}

customElements.define('ex-a', exElement.InheritFrom(class extends HTMLAnchorElement {}), { extends: "a" });
customElements.define('ex-abbr', exElement.InheritFrom(class extends HTMLElement {}), { extends: "abbr" });
customElements.define('ex-acronym', exElement.InheritFrom(class extends HTMLElement {}), { extends: "acronym" });
customElements.define('ex-address', exElement.InheritFrom(class extends HTMLElement {}), { extends: "address" });
customElements.define('ex-area', exElement.InheritFrom(class extends HTMLAreaElement {}), { extends: "area" });
customElements.define('ex-article', exElement.InheritFrom(class extends HTMLElement {}), { extends: "article" });
customElements.define('ex-aside', exElement.InheritFrom(class extends HTMLElement {}), { extends: "aside" });
customElements.define('ex-audio', exElement.InheritFrom(class extends HTMLAudioElement {}), { extends: "audio" });
customElements.define('ex-b', exElement.InheritFrom(class extends HTMLElement {}), { extends: "b" });
customElements.define('ex-base', exElement.InheritFrom(class extends HTMLBaseElement {}), { extends: "base" });
customElements.define('ex-basefont', exElement.InheritFrom(class extends HTMLElement {}), { extends: "basefont" });
customElements.define('ex-bdi', exElement.InheritFrom(class extends HTMLElement {}), { extends: "bdi" });
customElements.define('ex-bdo', exElement.InheritFrom(class extends HTMLElement {}), { extends: "bdo" });
customElements.define('ex-big', exElement.InheritFrom(class extends HTMLElement {}), { extends: "big" });
customElements.define('ex-blockquote', exElement.InheritFrom(class extends HTMLQuoteElement {}), { extends: "blockquote" });
customElements.define('ex-body', exElement.InheritFrom(class extends HTMLBodyElement {}), { extends: "body" });
customElements.define('ex-br', exElement.InheritFrom(class extends HTMLBRElement {}), { extends: "br" });
customElements.define('ex-button', exElement.InheritFrom(class extends HTMLButtonElement {}), { extends: "button" });
customElements.define('ex-canvas', exElement.InheritFrom(class extends HTMLCanvasElement {}), { extends: "canvas" });
customElements.define('ex-caption', exElement.InheritFrom(class extends HTMLTableCaptionElement {}), { extends: "caption" });
customElements.define('ex-center', exElement.InheritFrom(class extends HTMLElement {}), { extends: "center" });
customElements.define('ex-cite', exElement.InheritFrom(class extends HTMLElement {}), { extends: "cite" });
customElements.define('ex-code', exElement.InheritFrom(class extends HTMLElement {}), { extends: "code" });
customElements.define('ex-col', exElement.InheritFrom(class extends HTMLTableColElement {}), { extends: "col" });
customElements.define('ex-colgroup', exElement.InheritFrom(class extends HTMLTableColElement {}), { extends: "colgroup" });
customElements.define('ex-data', exElement.InheritFrom(class extends HTMLDataElement {}), { extends: "data" });
customElements.define('ex-datalist', exElement.InheritFrom(class extends HTMLDataListElement {}), { extends: "datalist" });
customElements.define('ex-dd', exElement.InheritFrom(class extends HTMLElement {}), { extends: "dd" });
customElements.define('ex-del', exElement.InheritFrom(class extends HTMLModElement {}), { extends: "del" });
customElements.define('ex-details', exElement.InheritFrom(class extends HTMLDetailsElement {}), { extends: "details" });
customElements.define('ex-dfn', exElement.InheritFrom(class extends HTMLElement {}), { extends: "dfn" });
customElements.define('ex-dialog', exElement.InheritFrom(class extends HTMLDialogElement {}), { extends: "dialog" });
customElements.define('ex-dir', exElement.InheritFrom(class extends HTMLDirectoryElement {}), { extends: "dir" });
customElements.define('ex-div', exElement.InheritFrom(class extends HTMLDivElement {}), { extends: "div" });
customElements.define('ex-dl', exElement.InheritFrom(class extends HTMLDListElement {}), { extends: "dl" });
customElements.define('ex-dt', exElement.InheritFrom(class extends HTMLElement {}), { extends: "dt" });
customElements.define('ex-em', exElement.InheritFrom(class extends HTMLElement {}), { extends: "em" });
customElements.define('ex-embed', exElement.InheritFrom(class extends HTMLEmbedElement {}), { extends: "embed" });
customElements.define('ex-fieldset', exElement.InheritFrom(class extends HTMLFieldSetElement {}), { extends: "fieldset" });
customElements.define('ex-figcaption', exElement.InheritFrom(class extends HTMLElement {}), { extends: "figcaption" });
customElements.define('ex-figure', exElement.InheritFrom(class extends HTMLElement {}), { extends: "figure" });
customElements.define('ex-font', exElement.InheritFrom(class extends HTMLFontElement {}), { extends: "font" });
customElements.define('ex-footer', exElement.InheritFrom(class extends HTMLElement {}), { extends: "footer" });
customElements.define('ex-form', exElement.InheritFrom(class extends HTMLFormElement {}), { extends: "form" });
customElements.define('ex-frame', exElement.InheritFrom(class extends HTMLFrameElement {}), { extends: "frame" });
customElements.define('ex-frameset', exElement.InheritFrom(class extends HTMLFrameSetElement {}), { extends: "frameset" });
customElements.define('ex-head', exElement.InheritFrom(class extends HTMLHeadElement {}), { extends: "head" });
customElements.define('ex-header', exElement.InheritFrom(class extends HTMLElement {}), { extends: "header" });
customElements.define('ex-hr', exElement.InheritFrom(class extends HTMLHRElement {}), { extends: "hr" });
customElements.define('ex-html', exElement.InheritFrom(class extends HTMLHtmlElement {}), { extends: "html" });
customElements.define('ex-i', exElement.InheritFrom(class extends HTMLElement {}), { extends: "i" });
customElements.define('ex-iframe', exElement.InheritFrom(class extends HTMLIFrameElement {}), { extends: "iframe" });
customElements.define('ex-img', exElement.InheritFrom(class extends HTMLImageElement {}), { extends: "img" });
customElements.define('ex-input', exElement.InheritFrom(class extends HTMLInputElement {}), { extends: "input" });
customElements.define('ex-ins', exElement.InheritFrom(class extends HTMLModElement {}), { extends: "ins" });
customElements.define('ex-kbd', exElement.InheritFrom(class extends HTMLElement {}), { extends: "kbd" });
customElements.define('ex-label', exElement.InheritFrom(class extends HTMLLabelElement {}), { extends: "label" });
customElements.define('ex-legend', exElement.InheritFrom(class extends HTMLLegendElement {}), { extends: "legend" });
customElements.define('ex-li', exElement.InheritFrom(class extends HTMLLIElement {}), { extends: "li" });
customElements.define('ex-link', exElement.InheritFrom(class extends HTMLLinkElement {}), { extends: "link" });
customElements.define('ex-main', exElement.InheritFrom(class extends HTMLElement {}), { extends: "main" });
customElements.define('ex-map', exElement.InheritFrom(class extends HTMLMapElement {}), { extends: "map" });
customElements.define('ex-mark', exElement.InheritFrom(class extends HTMLElement {}), { extends: "mark" });
customElements.define('ex-meta', exElement.InheritFrom(class extends HTMLMetaElement {}), { extends: "meta" });
customElements.define('ex-meter', exElement.InheritFrom(class extends HTMLMeterElement {}), { extends: "meter" });
customElements.define('ex-nav', exElement.InheritFrom(class extends HTMLElement {}), { extends: "nav" });
customElements.define('ex-noframes', exElement.InheritFrom(class extends HTMLElement {}), { extends: "noframes" });
customElements.define('ex-noscript', exElement.InheritFrom(class extends HTMLElement {}), { extends: "noscript" });
customElements.define('ex-object', exElement.InheritFrom(class extends HTMLObjectElement {}), { extends: "object" });
customElements.define('ex-ol', exElement.InheritFrom(class extends HTMLOListElement {}), { extends: "ol" });
customElements.define('ex-optgroup', exElement.InheritFrom(class extends HTMLOptGroupElement {}), { extends: "optgroup" });
customElements.define('ex-option', exElement.InheritFrom(class extends HTMLOptionElement {}), { extends: "option" });
customElements.define('ex-output', exElement.InheritFrom(class extends HTMLOutputElement {}), { extends: "output" });
customElements.define('ex-p', exElement.InheritFrom(class extends HTMLParagraphElement {}), { extends: "p" });
customElements.define('ex-param', exElement.InheritFrom(class extends HTMLParamElement {}), { extends: "param" });
customElements.define('ex-picture', exElement.InheritFrom(class extends HTMLPictureElement {}), { extends: "picture" });
customElements.define('ex-pre', exElement.InheritFrom(class extends HTMLPreElement {}), { extends: "pre" });
customElements.define('ex-progress', exElement.InheritFrom(class extends HTMLProgressElement {}), { extends: "progress" });
customElements.define('ex-q', exElement.InheritFrom(class extends HTMLQuoteElement {}), { extends: "q" });
customElements.define('ex-rp', exElement.InheritFrom(class extends HTMLElement {}), { extends: "rp" });
customElements.define('ex-rt', exElement.InheritFrom(class extends HTMLElement {}), { extends: "rt" });
customElements.define('ex-ruby', exElement.InheritFrom(class extends HTMLElement {}), { extends: "ruby" });
customElements.define('ex-s', exElement.InheritFrom(class extends HTMLElement {}), { extends: "s" });
customElements.define('ex-samp', exElement.InheritFrom(class extends HTMLElement {}), { extends: "samp" });
customElements.define('ex-script', exElement.InheritFrom(class extends HTMLScriptElement {}), { extends: "script" });
customElements.define('ex-section', exElement.InheritFrom(class extends HTMLElement {}), { extends: "section" });
customElements.define('ex-select', exElement.InheritFrom(class extends HTMLSelectElement {}), { extends: "select" });
customElements.define('ex-small', exElement.InheritFrom(class extends HTMLElement {}), { extends: "small" });
customElements.define('ex-source', exElement.InheritFrom(class extends HTMLSourceElement {}), { extends: "source" });
customElements.define('ex-span', exElement.InheritFrom(class extends HTMLSpanElement {}), { extends: "span" });
customElements.define('ex-strike', exElement.InheritFrom(class extends HTMLElement {}), { extends: "strike" });
customElements.define('ex-strong', exElement.InheritFrom(class extends HTMLElement {}), { extends: "strong" });
customElements.define('ex-style', exElement.InheritFrom(class extends HTMLStyleElement {}), { extends: "style" });
customElements.define('ex-sub', exElement.InheritFrom(class extends HTMLElement {}), { extends: "sub" });
customElements.define('ex-summary', exElement.InheritFrom(class extends HTMLElement {}), { extends: "summary" });
customElements.define('ex-sup', exElement.InheritFrom(class extends HTMLElement {}), { extends: "sup" });
customElements.define('ex-table', exElement.InheritFrom(class extends HTMLTableElement {}), { extends: "table" });
customElements.define('ex-tbody', exElement.InheritFrom(class extends HTMLTableSectionElement {}), { extends: "tbody" });
customElements.define('ex-td', exElement.InheritFrom(class extends HTMLTableCellElement {}), { extends: "td" });
customElements.define('ex-template', exElement.InheritFrom(class extends HTMLTemplateElement {}), { extends: "template" });
customElements.define('ex-textarea', exElement.InheritFrom(class extends HTMLTextAreaElement {}), { extends: "textarea" });
customElements.define('ex-tfoot', exElement.InheritFrom(class extends HTMLTableSectionElement {}), { extends: "tfoot" });
customElements.define('ex-th', exElement.InheritFrom(class extends HTMLTableCellElement {}), { extends: "th" });
customElements.define('ex-thead', exElement.InheritFrom(class extends HTMLTableSectionElement {}), { extends: "thead" });
customElements.define('ex-time', exElement.InheritFrom(class extends HTMLTimeElement {}), { extends: "time" });
customElements.define('ex-title', exElement.InheritFrom(class extends HTMLTitleElement {}), { extends: "title" });
customElements.define('ex-tr', exElement.InheritFrom(class extends HTMLTableRowElement {}), { extends: "tr" });
customElements.define('ex-track', exElement.InheritFrom(class extends HTMLTrackElement {}), { extends: "track" });
customElements.define('ex-tt', exElement.InheritFrom(class extends HTMLElement {}), { extends: "tt" });
customElements.define('ex-u', exElement.InheritFrom(class extends HTMLElement {}), { extends: "u" });
customElements.define('ex-ul', exElement.InheritFrom(class extends HTMLUListElement {}), { extends: "ul" });
customElements.define('ex-var', exElement.InheritFrom(class extends HTMLElement {}), { extends: "var" });
customElements.define('ex-video', exElement.InheritFrom(class extends HTMLVideoElement {}), { extends: "video" });
customElements.define('ex-wbr', exElement.InheritFrom(class extends HTMLElement {}), { extends: "wbr" });


var exCustomElements = null;

var exAttributeContainer = new Proxy({
}, {
    set: (target, key, newValue) => {
        attributeContainer.registerAttribute(key, newValue);
    }
});

export { exAttributeContainer as attributeContainer, exAttribute, exComponent, exCustomElements as exDiv, exIncludeHtml, stateManager };
