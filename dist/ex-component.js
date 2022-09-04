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

function parsePath(text) {
  return text.split('.')
}

function push(arr, el) {
  const newArr = arr.slice();
  newArr.push(el);
  return newArr;
}

const trapNames = [
  'apply',
  'construct',
  'defineProperty',
  'deleteProperty',
  'enumerate',
  'get',
  'getOwnPropertyDescriptor',
  'getPrototypeOf',
  'has',
  'isExtensible',
  'ownKeys',
  'preventExtensions',
  'set',
  'setPrototypeOf',
];
const keys = {
  get: 1,
  set: 1,
  deleteProperty: 1,
  has: 1,
  defineProperty: 1,
  getOwnPropertyDescriptor: 1,
};

function DeepProxy(rootTarget, traps, options) {

  let path = [];
  let userData = {};

  if (options !== undefined && typeof options.path !== 'undefined') {
    path = parsePath(options.path);
  }
  if (options !== undefined && typeof options.userData !== 'undefined') {
    userData = options.userData;
  }

  function createProxy(target, path) {

    // avoid creating a new object between two traps
    const context = { rootTarget, path };
    Object.assign(context, userData);

    const realTraps = {};

    for (const trapName of trapNames) {
      const keyParamIdx = keys[trapName]
          , trap = traps[trapName];

      if (typeof trap !== 'undefined') {

        if (typeof keyParamIdx !== 'undefined') {

          realTraps[trapName] = function () {

            const key = arguments[keyParamIdx];

            // update context for this trap
            context.nest = function (nestedTarget) {
              if (nestedTarget === undefined)
                nestedTarget = rootTarget;
              return createProxy(nestedTarget, push(path, key)); 
            };

            return trap.apply(context, arguments);
          };
        } else {
          realTraps[trapName] = function () {
            context.nest = function (nestedTarget) {
              if (nestedTarget === undefined)
                nestedTarget = {};
              return createProxy(nestedTarget, path);
            };

            return trap.apply(context, arguments);
          };
        }
      }
    }

    return new Proxy(target, realTraps);
  }

  return createProxy(rootTarget, path);

}

class stateManager {
    name = ""
    constructor(name) {
        this.name = name;
    }
    //Fields
    boundProp = "state"
    #state = null;

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
        const proxyManager = {
            get(target, key, receiver) {
                const val = Reflect.get(target, key, receiver);
                let path = [...this.path, key];
                that.accessedObservable.next(path);
                if (typeof val === 'object' && val !== null) {
                    //that.accessedPaths && that.accessedPaths.push([...this.path, key].join('.'));
                    return this.nest(val)
                } else {
                    that.accessedPaths && that.accessedPaths.push(path.join('.'));
                    return val
                }
            },
            set(obj, prop, val) {
                if (typeof val === 'object' && val !== null) {
                    value = this.nest(val);
                }
                obj[prop] = val;
                that.changedObservable.next(this.path.join('.'));
                return true;
            }
        };
        return DeepProxy(stateObj, proxyManager);//, { path: "state" }
    }

    GetAccessedPaths() {
        let accessedPathsResult = [];
        this.accessedPaths = [];
        return () => {
            accessedPathsResult = this.accessedPaths;
            this.accessedPaths = null;
            return accessedPathsResult;
        };
    }

}

class exAttribute {
    boundPaths = {}
    element = null
    static Priority = 0;
    
    constructor(element, binding) {
        this.element = element;
        this.binding = binding;
    }

    get context(){
        return this.element.context;
    }

    connectedCallback(){

    }

    disconnectedCallback(){

    }
}

const exceptionLogger = {
    logError: (exception) => {
        throw exception;
    }
};

class exModifierAttribute extends exAttribute {
    #boundPaths = new Set();
    #boundPathObservables = [];
    #boundPathSubscriptions = [];

    disconnectedCallback() {
        this.#boundPathSubscriptions.forEach(x=>x.unsubscribe());
    }

    dataCallback(data) {
    }

    #onDataChanged() {
        this.dataCallback(this.getData());
    }

    connectedCallback() {
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
    }

    getData() {
        return this.context.executeScopedExpression(this.binding);
    }
}

class exEventAttribute extends exAttribute {
    runEvent() {
        this.context.executeScopedExpression(this.binding);
    }
}

class exScope extends exAttribute {
    static Priority = 1;
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
    static Priority = 3;
    async connectedCallback() {
        let innerHTML = this.element.innerHTML;
        this.element.innerHTML = "";
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

            let stateManagerInstance = new stateManager(scopeVarName);
            stateManagerInstance.state = module;
            this.element.createContext();
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

class exBind extends exModifierAttribute {
    dataCallback(data) {
        this.element.innerHTML = data;
    }
}

class onClick extends exEventAttribute{
    connectedCallback(){
        this.element.addEventListener("click", ()=>{this.runEvent();});
    }

    disconnectedCallback(){

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
attributeContainer.registerAttribute("ex-scope", exScope);
attributeContainer.registerAttribute("ex-state", exState);
attributeContainer.registerAttribute("ex-bind", exBind);
attributeContainer.registerAttribute("ex-on-click", onClick);

// import { getComponentState, getComponentScope } from "./state-helpers.js";

class elementAttributeManager{

    // #scope = null;
    // #state = null;
    #eventAttributes = []
    #modifierAttributes = []
    #otherAttributes = []

    // getState(element){
    //     return this.#state || getComponentState(element) || null;
    // }

    // setState(state){
    //     this.#state = state;
    // }

    // getScope(element){
    //     return this.#scope || getComponentScope(element) || null;
    // }
    // setScope(value){
    //     this.#scope = value;
    // }

    disconnectedCallback(element) {
        this.#modifierAttributes.forEach(x => x.disconnectedCallback());
        this.#eventAttributes.forEach(x => x.disconnectedCallback());
        this.#otherAttributes.forEach(x => x.disconnectedCallback());
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

            attributeInstance instanceof exModifierAttribute ?
            this.#modifierAttributes.push(attributeInstance) :
                attributeInstance instanceof exEventAttribute ?
                this.#eventAttributes.push(attributeInstance) :
                this.#otherAttributes.push(attributeInstance);

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
};

/**
 * The context class is the class  that should contain
 */
class context {
    scopedVariables = [];
    constructor(scopedVariables = []) {
        this.scopedVariables = scopedVariables;
    }
    addVariable(name, value) {
        if (typeof value === "string" || typeof value === "number" || typeof value === "undefined") {
            throw "Invalid context type applied";
        }
        this.scopedVariables.push({ name, value });
    }

    getVariable(name) {
        return this.scopedVariables.filter(x => x.name == name)[0]?.value;
    }

    getScopedVariablesObj() {
        return arrayToObject(this.scopedVariables, (x) => x.name, (x) => x.value.boundProp ? x.value[x.value.boundProp] : x.value);
    }

    executeScopedExpression(expression) {
        let scopeNames = this.scopedVariables.map(x => x.name);
        let scopeValues = this.scopedVariables.map(x => x.value.boundProp ? x.value[x.value.boundProp] : x.value);
        return Function(...scopeNames, `return ${expression}`)(...scopeValues);
    }

    executeScopedStatement(expression) {
        let scopeNames = this.scopedVariables.map(x => x.name);
        let scopeValues = this.scopedVariables.map(x => x.value.boundProp ? x.value[x.value.boundProp] : x.value);
        return Function(...scopeNames, `${expression}`)(...scopeValues);
    }

    getOfType(type) {
        return this.scopedVariables.filter(x => x.value instanceof type).map(x => x.value);
    }

    getScopedVariables() {
        return this.scopedVariables;
    }
}

class exComponent //extends HTMLElement 
{

    get context() {
        return this._context || getComponentContext(this) || null;
    }
    set context(value) {
        this._context = this._context || value;
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

    createContext() {
        if (!this._context) {
            let parentScope = this.context?.scopedVariables || [];
            this._context = new context(parentScope);
        }
    }

    // get scope() {
    //     return this.attributeManager.getScope(this);
    // }
    // set scope(value) {
    //     this.attributeManager.setScope(value);
    // }

    // get state() {
    //     return this.attributeManager.getState(this);
    // }
    // set state(value) {
    //     this.attributeManager.setState(value);
    // }

    async connectedCallback() {
        await this.attributeManager.connectedCallback(this);
    }

    disconnectedCallback() {
        this.attributeManager.disconnectedCallback(this);
    }

    static InheritFrom(classDef) {
        Object.getOwnPropertyNames(exComponent.prototype).
            filter(x => x !== "constructor").
            forEach(x => Object.defineProperty(classDef.prototype, x, Object.getOwnPropertyDescriptor(exComponent.prototype, x)));
        return classDef;
    }
}

customElements.define('ex-a', exComponent.InheritFrom(class extends HTMLAnchorElement {}), { extends: "a" });
customElements.define('ex-abbr', exComponent.InheritFrom(class extends HTMLElement {}), { extends: "abbr" });
customElements.define('ex-acronym', exComponent.InheritFrom(class extends HTMLElement {}), { extends: "acronym" });
customElements.define('ex-address', exComponent.InheritFrom(class extends HTMLElement {}), { extends: "address" });
customElements.define('ex-area', exComponent.InheritFrom(class extends HTMLAreaElement {}), { extends: "area" });
customElements.define('ex-article', exComponent.InheritFrom(class extends HTMLElement {}), { extends: "article" });
customElements.define('ex-aside', exComponent.InheritFrom(class extends HTMLElement {}), { extends: "aside" });
customElements.define('ex-audio', exComponent.InheritFrom(class extends HTMLAudioElement {}), { extends: "audio" });
customElements.define('ex-b', exComponent.InheritFrom(class extends HTMLElement {}), { extends: "b" });
customElements.define('ex-base', exComponent.InheritFrom(class extends HTMLBaseElement {}), { extends: "base" });
customElements.define('ex-basefont', exComponent.InheritFrom(class extends HTMLElement {}), { extends: "basefont" });
customElements.define('ex-bdi', exComponent.InheritFrom(class extends HTMLElement {}), { extends: "bdi" });
customElements.define('ex-bdo', exComponent.InheritFrom(class extends HTMLElement {}), { extends: "bdo" });
customElements.define('ex-big', exComponent.InheritFrom(class extends HTMLElement {}), { extends: "big" });
customElements.define('ex-blockquote', exComponent.InheritFrom(class extends HTMLQuoteElement {}), { extends: "blockquote" });
customElements.define('ex-body', exComponent.InheritFrom(class extends HTMLBodyElement {}), { extends: "body" });
customElements.define('ex-br', exComponent.InheritFrom(class extends HTMLBRElement {}), { extends: "br" });
customElements.define('ex-button', exComponent.InheritFrom(class extends HTMLButtonElement {}), { extends: "button" });
customElements.define('ex-canvas', exComponent.InheritFrom(class extends HTMLCanvasElement {}), { extends: "canvas" });
customElements.define('ex-caption', exComponent.InheritFrom(class extends HTMLTableCaptionElement {}), { extends: "caption" });
customElements.define('ex-center', exComponent.InheritFrom(class extends HTMLElement {}), { extends: "center" });
customElements.define('ex-cite', exComponent.InheritFrom(class extends HTMLElement {}), { extends: "cite" });
customElements.define('ex-code', exComponent.InheritFrom(class extends HTMLElement {}), { extends: "code" });
customElements.define('ex-col', exComponent.InheritFrom(class extends HTMLTableColElement {}), { extends: "col" });
customElements.define('ex-colgroup', exComponent.InheritFrom(class extends HTMLTableColElement {}), { extends: "colgroup" });
customElements.define('ex-data', exComponent.InheritFrom(class extends HTMLDataElement {}), { extends: "data" });
customElements.define('ex-datalist', exComponent.InheritFrom(class extends HTMLDataListElement {}), { extends: "datalist" });
customElements.define('ex-dd', exComponent.InheritFrom(class extends HTMLElement {}), { extends: "dd" });
customElements.define('ex-del', exComponent.InheritFrom(class extends HTMLModElement {}), { extends: "del" });
customElements.define('ex-details', exComponent.InheritFrom(class extends HTMLDetailsElement {}), { extends: "details" });
customElements.define('ex-dfn', exComponent.InheritFrom(class extends HTMLElement {}), { extends: "dfn" });
customElements.define('ex-dialog', exComponent.InheritFrom(class extends HTMLDialogElement {}), { extends: "dialog" });
customElements.define('ex-dir', exComponent.InheritFrom(class extends HTMLDirectoryElement {}), { extends: "dir" });
customElements.define('ex-div', exComponent.InheritFrom(class extends HTMLDivElement {}), { extends: "div" });
customElements.define('ex-dl', exComponent.InheritFrom(class extends HTMLDListElement {}), { extends: "dl" });
customElements.define('ex-dt', exComponent.InheritFrom(class extends HTMLElement {}), { extends: "dt" });
customElements.define('ex-em', exComponent.InheritFrom(class extends HTMLElement {}), { extends: "em" });
customElements.define('ex-embed', exComponent.InheritFrom(class extends HTMLEmbedElement {}), { extends: "embed" });
customElements.define('ex-fieldset', exComponent.InheritFrom(class extends HTMLFieldSetElement {}), { extends: "fieldset" });
customElements.define('ex-figcaption', exComponent.InheritFrom(class extends HTMLElement {}), { extends: "figcaption" });
customElements.define('ex-figure', exComponent.InheritFrom(class extends HTMLElement {}), { extends: "figure" });
customElements.define('ex-font', exComponent.InheritFrom(class extends HTMLFontElement {}), { extends: "font" });
customElements.define('ex-footer', exComponent.InheritFrom(class extends HTMLElement {}), { extends: "footer" });
customElements.define('ex-form', exComponent.InheritFrom(class extends HTMLFormElement {}), { extends: "form" });
customElements.define('ex-frame', exComponent.InheritFrom(class extends HTMLFrameElement {}), { extends: "frame" });
customElements.define('ex-frameset', exComponent.InheritFrom(class extends HTMLFrameSetElement {}), { extends: "frameset" });
customElements.define('ex-head', exComponent.InheritFrom(class extends HTMLHeadElement {}), { extends: "head" });
customElements.define('ex-header', exComponent.InheritFrom(class extends HTMLElement {}), { extends: "header" });
customElements.define('ex-hr', exComponent.InheritFrom(class extends HTMLHRElement {}), { extends: "hr" });
customElements.define('ex-html', exComponent.InheritFrom(class extends HTMLHtmlElement {}), { extends: "html" });
customElements.define('ex-i', exComponent.InheritFrom(class extends HTMLElement {}), { extends: "i" });
customElements.define('ex-iframe', exComponent.InheritFrom(class extends HTMLIFrameElement {}), { extends: "iframe" });
customElements.define('ex-img', exComponent.InheritFrom(class extends HTMLImageElement {}), { extends: "img" });
customElements.define('ex-input', exComponent.InheritFrom(class extends HTMLInputElement {}), { extends: "input" });
customElements.define('ex-ins', exComponent.InheritFrom(class extends HTMLModElement {}), { extends: "ins" });
customElements.define('ex-kbd', exComponent.InheritFrom(class extends HTMLElement {}), { extends: "kbd" });
customElements.define('ex-label', exComponent.InheritFrom(class extends HTMLLabelElement {}), { extends: "label" });
customElements.define('ex-legend', exComponent.InheritFrom(class extends HTMLLegendElement {}), { extends: "legend" });
customElements.define('ex-li', exComponent.InheritFrom(class extends HTMLLIElement {}), { extends: "li" });
customElements.define('ex-link', exComponent.InheritFrom(class extends HTMLLinkElement {}), { extends: "link" });
customElements.define('ex-main', exComponent.InheritFrom(class extends HTMLElement {}), { extends: "main" });
customElements.define('ex-map', exComponent.InheritFrom(class extends HTMLMapElement {}), { extends: "map" });
customElements.define('ex-mark', exComponent.InheritFrom(class extends HTMLElement {}), { extends: "mark" });
customElements.define('ex-meta', exComponent.InheritFrom(class extends HTMLMetaElement {}), { extends: "meta" });
customElements.define('ex-meter', exComponent.InheritFrom(class extends HTMLMeterElement {}), { extends: "meter" });
customElements.define('ex-nav', exComponent.InheritFrom(class extends HTMLElement {}), { extends: "nav" });
customElements.define('ex-noframes', exComponent.InheritFrom(class extends HTMLElement {}), { extends: "noframes" });
customElements.define('ex-noscript', exComponent.InheritFrom(class extends HTMLElement {}), { extends: "noscript" });
customElements.define('ex-object', exComponent.InheritFrom(class extends HTMLObjectElement {}), { extends: "object" });
customElements.define('ex-ol', exComponent.InheritFrom(class extends HTMLOListElement {}), { extends: "ol" });
customElements.define('ex-optgroup', exComponent.InheritFrom(class extends HTMLOptGroupElement {}), { extends: "optgroup" });
customElements.define('ex-option', exComponent.InheritFrom(class extends HTMLOptionElement {}), { extends: "option" });
customElements.define('ex-output', exComponent.InheritFrom(class extends HTMLOutputElement {}), { extends: "output" });
customElements.define('ex-p', exComponent.InheritFrom(class extends HTMLParagraphElement {}), { extends: "p" });
customElements.define('ex-param', exComponent.InheritFrom(class extends HTMLParamElement {}), { extends: "param" });
customElements.define('ex-picture', exComponent.InheritFrom(class extends HTMLPictureElement {}), { extends: "picture" });
customElements.define('ex-pre', exComponent.InheritFrom(class extends HTMLPreElement {}), { extends: "pre" });
customElements.define('ex-progress', exComponent.InheritFrom(class extends HTMLProgressElement {}), { extends: "progress" });
customElements.define('ex-q', exComponent.InheritFrom(class extends HTMLQuoteElement {}), { extends: "q" });
customElements.define('ex-rp', exComponent.InheritFrom(class extends HTMLElement {}), { extends: "rp" });
customElements.define('ex-rt', exComponent.InheritFrom(class extends HTMLElement {}), { extends: "rt" });
customElements.define('ex-ruby', exComponent.InheritFrom(class extends HTMLElement {}), { extends: "ruby" });
customElements.define('ex-s', exComponent.InheritFrom(class extends HTMLElement {}), { extends: "s" });
customElements.define('ex-samp', exComponent.InheritFrom(class extends HTMLElement {}), { extends: "samp" });
customElements.define('ex-script', exComponent.InheritFrom(class extends HTMLScriptElement {}), { extends: "script" });
customElements.define('ex-section', exComponent.InheritFrom(class extends HTMLElement {}), { extends: "section" });
customElements.define('ex-select', exComponent.InheritFrom(class extends HTMLSelectElement {}), { extends: "select" });
customElements.define('ex-small', exComponent.InheritFrom(class extends HTMLElement {}), { extends: "small" });
customElements.define('ex-source', exComponent.InheritFrom(class extends HTMLSourceElement {}), { extends: "source" });
customElements.define('ex-span', exComponent.InheritFrom(class extends HTMLSpanElement {}), { extends: "span" });
customElements.define('ex-strike', exComponent.InheritFrom(class extends HTMLElement {}), { extends: "strike" });
customElements.define('ex-strong', exComponent.InheritFrom(class extends HTMLElement {}), { extends: "strong" });
customElements.define('ex-style', exComponent.InheritFrom(class extends HTMLStyleElement {}), { extends: "style" });
customElements.define('ex-sub', exComponent.InheritFrom(class extends HTMLElement {}), { extends: "sub" });
customElements.define('ex-summary', exComponent.InheritFrom(class extends HTMLElement {}), { extends: "summary" });
customElements.define('ex-sup', exComponent.InheritFrom(class extends HTMLElement {}), { extends: "sup" });
customElements.define('ex-table', exComponent.InheritFrom(class extends HTMLTableElement {}), { extends: "table" });
customElements.define('ex-tbody', exComponent.InheritFrom(class extends HTMLTableSectionElement {}), { extends: "tbody" });
customElements.define('ex-td', exComponent.InheritFrom(class extends HTMLTableCellElement {}), { extends: "td" });
customElements.define('ex-template', exComponent.InheritFrom(class extends HTMLTemplateElement {}), { extends: "template" });
customElements.define('ex-textarea', exComponent.InheritFrom(class extends HTMLTextAreaElement {}), { extends: "textarea" });
customElements.define('ex-tfoot', exComponent.InheritFrom(class extends HTMLTableSectionElement {}), { extends: "tfoot" });
customElements.define('ex-th', exComponent.InheritFrom(class extends HTMLTableCellElement {}), { extends: "th" });
customElements.define('ex-thead', exComponent.InheritFrom(class extends HTMLTableSectionElement {}), { extends: "thead" });
customElements.define('ex-time', exComponent.InheritFrom(class extends HTMLTimeElement {}), { extends: "time" });
customElements.define('ex-title', exComponent.InheritFrom(class extends HTMLTitleElement {}), { extends: "title" });
customElements.define('ex-tr', exComponent.InheritFrom(class extends HTMLTableRowElement {}), { extends: "tr" });
customElements.define('ex-track', exComponent.InheritFrom(class extends HTMLTrackElement {}), { extends: "track" });
customElements.define('ex-tt', exComponent.InheritFrom(class extends HTMLElement {}), { extends: "tt" });
customElements.define('ex-u', exComponent.InheritFrom(class extends HTMLElement {}), { extends: "u" });
customElements.define('ex-ul', exComponent.InheritFrom(class extends HTMLUListElement {}), { extends: "ul" });
customElements.define('ex-var', exComponent.InheritFrom(class extends HTMLElement {}), { extends: "var" });
customElements.define('ex-video', exComponent.InheritFrom(class extends HTMLVideoElement {}), { extends: "video" });
customElements.define('ex-wbr', exComponent.InheritFrom(class extends HTMLElement {}), { extends: "wbr" });


var exCustomElements = null;

export { exAttribute, exComponent, exCustomElements as exDiv, exEventAttribute, exModifierAttribute, exScope, exState, stateManager };
