/*! (c) Andrea Giammarchi @webreflection ISC */
(function () {

  var attributesObserver = (function (whenDefined, MutationObserver) {
    var attributeChanged = function attributeChanged(records) {
      for (var i = 0, length = records.length; i < length; i++) {
        dispatch(records[i]);
      }
    };

    var dispatch = function dispatch(_ref) {
      var target = _ref.target,
          attributeName = _ref.attributeName,
          oldValue = _ref.oldValue;
      target.attributeChangedCallback(attributeName, oldValue, target.getAttribute(attributeName));
    };

    return function (target, is) {
      var attributeFilter = target.constructor.observedAttributes;

      if (attributeFilter) {
        whenDefined(is).then(function () {
          new MutationObserver(attributeChanged).observe(target, {
            attributes: true,
            attributeOldValue: true,
            attributeFilter: attributeFilter
          });

          for (var i = 0, length = attributeFilter.length; i < length; i++) {
            if (target.hasAttribute(attributeFilter[i])) dispatch({
              target: target,
              attributeName: attributeFilter[i],
              oldValue: null
            });
          }
        });
      }

      return target;
    };
  });

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];

    if (!it) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function () {};

        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function () {
        it = it.call(o);
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  /*! (c) Andrea Giammarchi - ISC */
  var TRUE = true,
      FALSE = false,
      QSA$1 = 'querySelectorAll';
  /**
   * Start observing a generic document or root element.
   * @param {(node:Element, connected:boolean) => void} callback triggered per each dis/connected element
   * @param {Document|Element} [root=document] by default, the global document to observe
   * @param {Function} [MO=MutationObserver] by default, the global MutationObserver
   * @param {string[]} [query=['*']] the selectors to use within nodes
   * @returns {MutationObserver}
   */

  var notify = function notify(callback) {
    var root = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
    var MO = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : MutationObserver;
    var query = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : ['*'];

    var loop = function loop(nodes, selectors, added, removed, connected, pass) {
      var _iterator = _createForOfIteratorHelper(nodes),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var node = _step.value;

          if (pass || QSA$1 in node) {
            if (connected) {
              if (!added.has(node)) {
                added.add(node);
                removed["delete"](node);
                callback(node, connected);
              }
            } else if (!removed.has(node)) {
              removed.add(node);
              added["delete"](node);
              callback(node, connected);
            }

            if (!pass) loop(node[QSA$1](selectors), selectors, added, removed, connected, TRUE);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    };

    var mo = new MO(function (records) {
      if (query.length) {
        var selectors = query.join(',');
        var added = new Set(),
            removed = new Set();

        var _iterator2 = _createForOfIteratorHelper(records),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var _step2$value = _step2.value,
                addedNodes = _step2$value.addedNodes,
                removedNodes = _step2$value.removedNodes;
            loop(removedNodes, selectors, added, removed, FALSE, FALSE);
            loop(addedNodes, selectors, added, removed, TRUE, FALSE);
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }
    });
    var observe = mo.observe;
    (mo.observe = function (node) {
      return observe.call(mo, node, {
        subtree: TRUE,
        childList: TRUE
      });
    })(root);
    return mo;
  };

  var QSA = 'querySelectorAll';
  var _self$1 = self,
      document$2 = _self$1.document,
      Element$1 = _self$1.Element,
      MutationObserver$2 = _self$1.MutationObserver,
      Set$2 = _self$1.Set,
      WeakMap$1 = _self$1.WeakMap;

  var elements = function elements(element) {
    return QSA in element;
  };

  var filter = [].filter;
  var qsaObserver = (function (options) {
    var live = new WeakMap$1();

    var drop = function drop(elements) {
      for (var i = 0, length = elements.length; i < length; i++) {
        live["delete"](elements[i]);
      }
    };

    var flush = function flush() {
      var records = observer.takeRecords();

      for (var i = 0, length = records.length; i < length; i++) {
        parse(filter.call(records[i].removedNodes, elements), false);
        parse(filter.call(records[i].addedNodes, elements), true);
      }
    };

    var matches = function matches(element) {
      return element.matches || element.webkitMatchesSelector || element.msMatchesSelector;
    };

    var notifier = function notifier(element, connected) {
      var selectors;

      if (connected) {
        for (var q, m = matches(element), i = 0, length = query.length; i < length; i++) {
          if (m.call(element, q = query[i])) {
            if (!live.has(element)) live.set(element, new Set$2());
            selectors = live.get(element);

            if (!selectors.has(q)) {
              selectors.add(q);
              options.handle(element, connected, q);
            }
          }
        }
      } else if (live.has(element)) {
        selectors = live.get(element);
        live["delete"](element);
        selectors.forEach(function (q) {
          options.handle(element, connected, q);
        });
      }
    };

    var parse = function parse(elements) {
      var connected = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      for (var i = 0, length = elements.length; i < length; i++) {
        notifier(elements[i], connected);
      }
    };

    var query = options.query;
    var root = options.root || document$2;
    var observer = notify(notifier, root, MutationObserver$2, query);
    var attachShadow = Element$1.prototype.attachShadow;
    if (attachShadow) Element$1.prototype.attachShadow = function (init) {
      var shadowRoot = attachShadow.call(this, init);
      observer.observe(shadowRoot);
      return shadowRoot;
    };
    if (query.length) parse(root[QSA](query));
    return {
      drop: drop,
      flush: flush,
      observer: observer,
      parse: parse
    };
  });

  var _self = self,
      document$1 = _self.document,
      Map = _self.Map,
      MutationObserver$1 = _self.MutationObserver,
      Object$1 = _self.Object,
      Set$1 = _self.Set,
      WeakMap = _self.WeakMap,
      Element = _self.Element,
      HTMLElement = _self.HTMLElement,
      Node = _self.Node,
      Error = _self.Error,
      TypeError$1 = _self.TypeError,
      Reflect = _self.Reflect;
  var defineProperty = Object$1.defineProperty,
      keys = Object$1.keys,
      getOwnPropertyNames = Object$1.getOwnPropertyNames,
      setPrototypeOf = Object$1.setPrototypeOf;
  var legacy = !self.customElements;

  var expando = function expando(element) {
    var key = keys(element);
    var value = [];
    var length = key.length;

    for (var i = 0; i < length; i++) {
      value[i] = element[key[i]];
      delete element[key[i]];
    }

    return function () {
      for (var _i = 0; _i < length; _i++) {
        element[key[_i]] = value[_i];
      }
    };
  };

  if (legacy) {
    var HTMLBuiltIn = function HTMLBuiltIn() {
      var constructor = this.constructor;
      if (!classes.has(constructor)) throw new TypeError$1('Illegal constructor');
      var is = classes.get(constructor);
      if (override) return augment(override, is);
      var element = createElement.call(document$1, is);
      return augment(setPrototypeOf(element, constructor.prototype), is);
    };

    var createElement = document$1.createElement;
    var classes = new Map();
    var defined = new Map();
    var prototypes = new Map();
    var registry = new Map();
    var query = [];

    var handle = function handle(element, connected, selector) {
      var proto = prototypes.get(selector);

      if (connected && !proto.isPrototypeOf(element)) {
        var redefine = expando(element);
        override = setPrototypeOf(element, proto);

        try {
          new proto.constructor();
        } finally {
          override = null;
          redefine();
        }
      }

      var method = "".concat(connected ? '' : 'dis', "connectedCallback");
      if (method in proto) element[method]();
    };

    var _qsaObserver = qsaObserver({
      query: query,
      handle: handle
    }),
        parse = _qsaObserver.parse;

    var override = null;

    var whenDefined = function whenDefined(name) {
      if (!defined.has(name)) {
        var _,
            $ = new Promise(function ($) {
          _ = $;
        });

        defined.set(name, {
          $: $,
          _: _
        });
      }

      return defined.get(name).$;
    };

    var augment = attributesObserver(whenDefined, MutationObserver$1);
    defineProperty(self, 'customElements', {
      configurable: true,
      value: {
        define: function define(is, Class) {
          if (registry.has(is)) throw new Error("the name \"".concat(is, "\" has already been used with this registry"));
          classes.set(Class, is);
          prototypes.set(is, Class.prototype);
          registry.set(is, Class);
          query.push(is);
          whenDefined(is).then(function () {
            parse(document$1.querySelectorAll(is));
          });

          defined.get(is)._(Class);
        },
        get: function get(is) {
          return registry.get(is);
        },
        whenDefined: whenDefined
      }
    });
    defineProperty(HTMLBuiltIn.prototype = HTMLElement.prototype, 'constructor', {
      value: HTMLBuiltIn
    });
    defineProperty(self, 'HTMLElement', {
      configurable: true,
      value: HTMLBuiltIn
    });
    defineProperty(document$1, 'createElement', {
      configurable: true,
      value: function value(name, options) {
        var is = options && options.is;
        var Class = is ? registry.get(is) : registry.get(name);
        return Class ? new Class() : createElement.call(document$1, name);
      }
    }); // in case ShadowDOM is used through a polyfill, to avoid issues
    // with builtin extends within shadow roots

    if (!('isConnected' in Node.prototype)) defineProperty(Node.prototype, 'isConnected', {
      configurable: true,
      get: function get() {
        return !(this.ownerDocument.compareDocumentPosition(this) & this.DOCUMENT_POSITION_DISCONNECTED);
      }
    });
  } else {
    try {
      var LI = function LI() {
        return self.Reflect.construct(HTMLLIElement, [], LI);
      };

      LI.prototype = HTMLLIElement.prototype;
      var is = 'extends-li';
      self.customElements.define('extends-li', LI, {
        'extends': 'li'
      });
      legacy = document$1.createElement('li', {
        is: is
      }).outerHTML.indexOf(is) < 0;
      var _self$customElements = self.customElements,
          get = _self$customElements.get,
          _whenDefined = _self$customElements.whenDefined;
      defineProperty(self.customElements, 'whenDefined', {
        configurable: true,
        value: function value(is) {
          var _this = this;

          return _whenDefined.call(this, is).then(function (Class) {
            return Class || get.call(_this, is);
          });
        }
      });
    } catch (o_O) {
      legacy = !legacy;
    }
  }

  if (legacy) {
    var parseShadow = function parseShadow(element) {
      var root = shadowRoots.get(element);

      _parse(root.querySelectorAll(this), element.isConnected);
    };

    var customElements = self.customElements;
    var _createElement = document$1.createElement;
    var define = customElements.define,
        _get = customElements.get,
        upgrade = customElements.upgrade;

    var _ref = Reflect || {
      construct: function construct(HTMLElement) {
        return HTMLElement.call(this);
      }
    },
        construct = _ref.construct;

    var shadowRoots = new WeakMap();
    var shadows = new Set$1();

    var _classes = new Map();

    var _defined = new Map();

    var _prototypes = new Map();

    var _registry = new Map();

    var shadowed = [];
    var _query = [];

    var getCE = function getCE(is) {
      return _registry.get(is) || _get.call(customElements, is);
    };

    var _handle = function _handle(element, connected, selector) {
      var proto = _prototypes.get(selector);

      if (connected && !proto.isPrototypeOf(element)) {
        var redefine = expando(element);
        _override = setPrototypeOf(element, proto);

        try {
          new proto.constructor();
        } finally {
          _override = null;
          redefine();
        }
      }

      var method = "".concat(connected ? '' : 'dis', "connectedCallback");
      if (method in proto) element[method]();
    };

    var _qsaObserver2 = qsaObserver({
      query: _query,
      handle: _handle
    }),
        _parse = _qsaObserver2.parse;

    var _qsaObserver3 = qsaObserver({
      query: shadowed,
      handle: function handle(element, connected) {
        if (shadowRoots.has(element)) {
          if (connected) shadows.add(element);else shadows["delete"](element);
          if (_query.length) parseShadow.call(_query, element);
        }
      }
    }),
        parseShadowed = _qsaObserver3.parse; // qsaObserver also patches attachShadow
    // be sure this runs *after* that


    var attachShadow = Element.prototype.attachShadow;
    if (attachShadow) Element.prototype.attachShadow = function (init) {
      var root = attachShadow.call(this, init);
      shadowRoots.set(this, root);
      return root;
    };

    var _whenDefined2 = function _whenDefined2(name) {
      if (!_defined.has(name)) {
        var _,
            $ = new Promise(function ($) {
          _ = $;
        });

        _defined.set(name, {
          $: $,
          _: _
        });
      }

      return _defined.get(name).$;
    };

    var _augment = attributesObserver(_whenDefined2, MutationObserver$1);

    var _override = null;
    getOwnPropertyNames(self).filter(function (k) {
      return /^HTML.*Element$/.test(k);
    }).forEach(function (k) {
      var HTMLElement = self[k];

      function HTMLBuiltIn() {
        var constructor = this.constructor;
        if (!_classes.has(constructor)) throw new TypeError$1('Illegal constructor');

        var _classes$get = _classes.get(constructor),
            is = _classes$get.is,
            tag = _classes$get.tag;

        if (is) {
          if (_override) return _augment(_override, is);

          var element = _createElement.call(document$1, tag);

          element.setAttribute('is', is);
          return _augment(setPrototypeOf(element, constructor.prototype), is);
        } else return construct.call(this, HTMLElement, [], constructor);
      }


      defineProperty(HTMLBuiltIn.prototype = HTMLElement.prototype, 'constructor', {
        value: HTMLBuiltIn
      });
      defineProperty(self, k, {
        value: HTMLBuiltIn
      });
    });
    defineProperty(document$1, 'createElement', {
      configurable: true,
      value: function value(name, options) {
        var is = options && options.is;

        if (is) {
          var Class = _registry.get(is);

          if (Class && _classes.get(Class).tag === name) return new Class();
        }

        var element = _createElement.call(document$1, name);

        if (is) element.setAttribute('is', is);
        return element;
      }
    });
    defineProperty(customElements, 'get', {
      configurable: true,
      value: getCE
    });
    defineProperty(customElements, 'whenDefined', {
      configurable: true,
      value: _whenDefined2
    });
    defineProperty(customElements, 'upgrade', {
      configurable: true,
      value: function value(element) {
        var is = element.getAttribute('is');

        if (is) {
          var _constructor = _registry.get(is);

          if (_constructor) {
            _augment(setPrototypeOf(element, _constructor.prototype), is); // apparently unnecessary because this is handled by qsa observer
            // if (element.isConnected && element.connectedCallback)
            //   element.connectedCallback();


            return;
          }
        }

        upgrade.call(customElements, element);
      }
    });
    defineProperty(customElements, 'define', {
      configurable: true,
      value: function value(is, Class, options) {
        if (getCE(is)) throw new Error("'".concat(is, "' has already been defined as a custom element"));
        var selector;
        var tag = options && options["extends"];

        _classes.set(Class, tag ? {
          is: is,
          tag: tag
        } : {
          is: '',
          tag: is
        });

        if (tag) {
          selector = "".concat(tag, "[is=\"").concat(is, "\"]");

          _prototypes.set(selector, Class.prototype);

          _registry.set(is, Class);

          _query.push(selector);
        } else {
          define.apply(customElements, arguments);
          shadowed.push(selector = is);
        }

        _whenDefined2(is).then(function () {
          if (tag) {
            _parse(document$1.querySelectorAll(selector));

            shadows.forEach(parseShadow, [selector]);
          } else parseShadowed(document$1.querySelectorAll(selector));
        });

        _defined.get(is)._(Class);
      }
    });
  }

})();

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

    attachReplacements(element, replacements) {
        let positionMarker = this.positionMarkerElements.get(element);
        if (element.isConnected || !positionMarker) return;
        if (!Array.isArray(replacements)) {
            console.log("attachReplacements method need an array of elements to replace with.");
            return;
        }
        let replacementTarget = positionMarker;
        for (let replacement of replacements) {
            positionMarker.parentElement.insertBefore(replacement, replacementTarget.nextSibling ||replacementTarget );
            replacementTarget = replacement;
        }
        positionMarker.parentElement.removeChild(positionMarker);
        this.positionMarkerElements.delete(element);
    }

    isAttached(element) {
        return !this.positionMarkerElements.get(element);
    }
}

const detachedElementContainer = new _detachedElementContainer();

/**
 * @param {HTMLElement} element 
 */
const getComponentState = (element) => {
    while (element.parentElement != null) {
        element = element.parentElement;
        if (element.scope != null) return element.scope;
    }
    return element.getRootNode()?.scope ?? null;
};

const proxyConstructorFactory = (factory) => {
    return new Proxy(function () { }, {
        construct: (target, args) => {
            return factory(...args);
        }
    });
};

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

var context = null;
function errorContext(cb) {
    if (config.useDeprecatedSynchronousErrorHandling) {
        var isRoot = !context;
        if (isRoot) {
            context = { errorThrown: false, error: null };
        }
        cb();
        if (isRoot) {
            var _a = context, errorThrown = _a.errorThrown, error = _a.error;
            context = null;
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

/**
 * Core communicator object between state proxies and state observers
 */
const coreCommunicator = {
    pathMonitoringIndicator: false,
    pathAccessedObservable: new Subject(),
    pathChangedObservable: new Subject(),
    debugNotificationObservable: new Subject()
};

let proxyId = 0;
let proxyIdSymbol$2 = Symbol.for("proxyIdSymbol");
const observableProxyFactory = (name, object) => {
    if (typeof object !== "object") throw "Proxy object should be an object";

    const getHandler = (path, value) => {
        let proxyHandler = {
            get(target, key, receiver) {
                let result = target[key];
                if (typeof (key) === "symbol" || key === "__boundProp") {
                    return result;
                }
                if (key === "__isProxy") {
                    return true;
                }
                coreCommunicator.pathMonitoringIndicator && coreCommunicator.pathAccessedObservable.next(`${path}.${key}`);
                if (typeof result === "object" && result !== null && result.__objectPath === undefined) {
                    result = new Proxy(result, getHandler(`${path}.${key}`, result));
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
                value = typeof value === "object" && value !== null && !value.__isProxy ? new Proxy(value.__originalObject ?? value, getHandler(`${path}.${prop}`, value)) : value;
                target[prop] = value;
                coreCommunicator.pathChangedObservable.next(`${path}.${prop}`);
                return true;
            }
        };
        if (typeof value === "object" && value !== null && !value[proxyIdSymbol$2]) {
            value[proxyIdSymbol$2] = proxyId++;
        }
        return proxyHandler;
    };
    return new Proxy(object, getHandler(name));
};

var observerProxy = proxyConstructorFactory(observableProxyFactory);

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

const scopeProxyHandler = {
    get: (target, key, receiver) => {
        key === "_target" && target || target[key];
        return {
            "_target": () => target,
            "$": () => {
                return (expression, scopedValues = {}) => {
                    let keys = Object.getOwnPropertyNames(target);
                    let values = keys.map(x => target[x]);
                    let scopeKeys = Object.getOwnPropertyNames(scopedValues);
                    let scopeValues = scopeKeys.map(x => scopedValues[x]);
                    keys = [...keys, ...scopeKeys];
                    values = [...values, ...scopeValues];
                    return Function(...keys, `return ${expression}`)(...values);
                };
            },
            "observe":  () => {
                return (name) => {
                target[name] = target[name].__isProxy ? target[name] :  new observerProxy(name, target[name]) ;
            }}
        }[key]?.() || target[key];
    },
    set: (target, prop, value, proxyInstance) => {
        if (!{ function: false, object: true }[typeof (value)]) {
            coreCommunicator.debugNotificationObservable.next(new error("Sate", `Invalid value assigned to execution context. Type ${value} not supported.`));
            return false;
        }
        target[prop] = value;
        return true;
    }
};

const getScopeObj = (parentScope) => {
    return parentScope ?? {};
};

const scope = proxyConstructorFactory((parentScope) => new Proxy(getScopeObj(parentScope), scopeProxyHandler));

class exAttribute {
    #boundPaths = new Set();
    #events = [];
    #boundPathObservable = null;
    #boundPathSubscription = null;
    tagName = "";
    simpleValue = false;

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


    get scope() {
        return this.element.scope;
    }

    async connectedCallback() {
        await this.onConnected?.();
        await this.init?.();
        await this.dataCallback && this.bindElement();
    }

    disconnectedCallback() {
        this.onDisconnected?.();
        this.onLoad?.();
        this.dataCallback && this.unbindAttribute();
        this.unbindEvents();
    }

    unbindEvents() {
        for (let eventItem of this.#events) {
            this.element.removeEventListener(eventItem.eventName, eventItem.eventFunction);
        }
    }

    //Events
    addEvent(eventName, eventFunction) {
        this.#events.push({ eventName, eventFunction });
        this.element.addEventListener(eventName, eventFunction);
    }

    runEvent(binding = this.binding) {
        this.scope.$(binding);
    }

    //bound attributes
    unbindAttribute() {
        this.#boundPathSubscription?.unsubscribe();
    }

    // dataCallback(data) {
    // }

    #onDataChanged() {
        this.dataCallback(this.getData());
    }

    unsubscribe() {
        this.#boundPathSubscription?.unsubscribe();
    }

    bindElement() {
        coreCommunicator.pathMonitoringIndicator = true;
        let monitorSubscription = coreCommunicator.pathAccessedObservable.subscribe((path)=>{
            this.#boundPaths.add(path);
        });
        let boundValue = this.getData();
        coreCommunicator.pathMonitoringIndicator = false;
        monitorSubscription.unsubscribe();

        this.dataCallback(boundValue);
   
        this.#boundPathObservable = coreCommunicator.pathChangedObservable.pipe(filter(path => this.#boundPaths.has(path)));

        this.#boundPathSubscription = this.#boundPathObservable.subscribe((data) => this.#onDataChanged(data));
        this.afterConnected && this.afterConnected();
    }

    getData() {
        return this.simpleValue ? this.binding : this.scope.$(this.binding);
    }

}

class exScope extends exAttribute {
    static Priority = 4;
    async onConnected() {
        this.element.createScope(true, true);
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
            this.scope[scopeVarName] = module;
        }
    }

    //Module parameters should be in the following format: ({scope1, scope, state})
    async getModuleInstance(moduleDefinition) {
        if (typeof moduleDefinition === "function") {
            if (moduleDefinition.prototype) {
                return new moduleDefinition(this.state?._target || {});
            }
            return await moduleDefinition(this.state?._target || {});
        }
        return moduleDefinition;
    }
}

class exState extends exAttribute {
    static Priority = 5;
    async onConnected() {
        let innerHTML = this.element.innerHTML;
        this.element.innerHTML = "";
        let scopeObj = await Function(`return ${this.binding}`)();
        this.element.createScope(true, true);
     
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
            this.scope[scopeVarName] = module;
            this.scope.observe(scopeVarName);
        }
        this.element.innerHTML = innerHTML;
    }

    async getModuleInstance(moduleDefinition) {
        if (typeof moduleDefinition === "function") {
            if (moduleDefinition.prototype) {
                return new moduleDefinition(this.state?._target || {});
            }
            return await moduleDefinition(this.state?._target || {});
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

class exLoop extends exAttribute {
    #duplicatedItems = [];
    #originalElement = null;
    #toDuplicate = null;
    #documentElement = null;
    simpleValue = true;

    /**
     * 
     * @param {string} data 
     * @returns 
     */
    dataCallback(data) {
        data = data.trim();
        if (data.indexOf(" ") < 0) throw `Invalid expression for loop: ${data}`;
        let expressionParts = data.substring(data.indexOf(" ")).trim().split(" of ");
        if (expressionParts.length != 2) throw `Invalid expression for loop: ${data}`;
        let variableName = expressionParts[0];
        let loopArray = this.scope.$(expressionParts[1]);
        if (!this.#originalElement) {
            let childContext = this.scope._target || {};
            childContext[variableName] = {};
           // this.element.createScope(true,true);

            this.#originalElement = this.element;
            this.#toDuplicate = this.element.cloneNode(true);
            this.#toDuplicate.removeAttribute("ex-repeat");
            detachedElementContainer.addElement(this.element.parentElement, this);
            this.#documentElement = this.element.parentElement;
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
            let childContext = this.scope._target || {};
            childContext[variableName] = loopItem;
            toAdd.scope = new scope({...childContext});
            this.#documentElement.appendChild(toAdd);
            this.#duplicatedItems.push(toAdd);
        }
    }
}

class exIf extends exAttribute {
    static Priority = 2;
    #toInsert = null;
    #element = null;
    #originalElement = null;
    disconnectedCallback() {
    }

    async onConnected(){
        this.element.removeAttribute("ex-if");
        this.#toInsert = this.element.cloneNode(true);
        this.#element = this.element;
        this.#originalElement = this.element.cloneNode(true);
        this.element.DOM.persistInstance();
    }

    dataCallback(data) {
        let shouldAttach = !!data;
        if (this.#element.DOM.isAttached() && !shouldAttach) {
            this.#element.DOM.detach(`Removed by: ${this.tagName}; Expression: ${this.binding}`);
        } else if (!this.#element.DOM.isAttached()  && shouldAttach) {
            this.#toInsert = this.#originalElement.cloneNode(true);
            this.#element.DOM.attachReplacement(this.#toInsert);
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
    urlChanged(event) {
        console.log(event.state);
    }

    async onConnected() {
        let routeValues = getHashValues();
        this.scope.route = { path: routeValues.path };
        this.scope.observe("route");
        window.onpopstate = () => {
            this.scope.route.path = getHashValues().path;
        };
    }

    disconnectedCallback() {

    }
}

class exInclude$1 extends exAttribute {
    async onConnected() {
        const htmlRequest = new Request(this.binding); 
        const response = await fetch(htmlRequest);
        if (response.ok){
            let html = await response.text();
            this.element.getRootElement().innerHTML = html;
        }
    }
}

let proxyIdSymbol$1 = Symbol.for("proxyIdSymbol");
class exModel extends exAttribute {
    dataCallback(data) {
        data ??= '';
        data = data && typeof (data) === "object" && data[proxyIdSymbol$1] ? data[proxyIdSymbol$1] : data;
        this.element.value = data;
        this.element.refreshModel = () => {
            this.element.value = data;
        };
    }

    afterConnected() {
        this.element.addEventListener("input", () => {
            this.runEvent();
        });
    }

    runEvent() {
        let value = this.element.tagName.toLowerCase() === "select" ? this.element.selectedOptions[0]?._value : this.element.value ;
        this.scope.$(`${this.binding} = elementValue`, { elementValue: value });
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
    async onConnected() {
        this.scope.$(`${this.binding} = ${this.binding}.bind(elm)`, { elm: this.element });
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
            this.scope.$(`${this.binding} = elementValue`, { elementValue: this.#lastValue });
        }
    }
}

class exClearState extends exAttribute {
    static Priority = 5;
    dataCallback(data) {
        this.element.createScope(true, true, data ?? []);
    }
}

let proxyIdSymbol = Symbol.for("proxyIdSymbol");
class exValue extends exAttribute {
    dataCallback(data) {
        this.element._value = data;
        data = data && typeof (data) === "object" && data[proxyIdSymbol] ? data[proxyIdSymbol] : data;
        this.element.value = data;
        this.element.parentElement?.refreshModel?.();
    }
}

class _attributeRegistry {
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

const attributeRegistry = new _attributeRegistry();
attributeRegistry.registerAttribute("ex-scopes", exScope);
attributeRegistry.registerAttribute("ex-states", exState);
attributeRegistry.registerAttribute("ex-bind", exBind);
attributeRegistry.registerAttribute("ex-on-click", onClick);
attributeRegistry.registerAttribute("ex-repeat", exLoop);
attributeRegistry.registerAttribute("ex-if", exIf);
attributeRegistry.registerAttribute("ex-route", exRoute);
attributeRegistry.registerAttribute("ex-include", exInclude$1);
attributeRegistry.registerAttribute("ex-model", exModel);
attributeRegistry.registerAttribute("ex-disabled", exDisabled);
attributeRegistry.registerAttribute("ex-classes", exClass);
attributeRegistry.registerAttribute("ex-on-blur", exOnBlur);
attributeRegistry.registerAttribute("ex-on-change", exOnChange);
attributeRegistry.registerAttribute("ex-on-dblclick", exOnDblclick);
attributeRegistry.registerAttribute("ex-on-focus", exOnFocus);
attributeRegistry.registerAttribute("ex-on", exOn);
attributeRegistry.registerAttribute("ex-this", exThis);
attributeRegistry.registerAttribute("ex-hide", exHide);
attributeRegistry.registerAttribute("ex-href", exHref);
attributeRegistry.registerAttribute("ex-attributes", exHref);
attributeRegistry.registerAttribute("ex-checked", exCheck);
attributeRegistry.registerAttribute("ex-clear-state", exClearState);
attributeRegistry.registerAttribute("ex-value", exValue);

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
        let dataAttributes = elementAttributes.filter(x => x.name.startsWith("ex-data-"));

        dataAttributes.forEach(x=>{
            let valueName = x.name.replace("ex-data-","");
            element.data[valueName] = element.dataBindings[valueName] ? x.value : element.scope.$(x.value);
        });
        
        elementAttributes  = elementAttributes.filter(x => !x.name.startsWith("ex-data-"));

        let attributeDefinitions = elementAttributes.
            filter(x => {
                if (attributeRegistry.getAttribute(x.name)) {
                    return true;
                }
                coreCommunicator.debugNotificationObservable.next(new error("Attribute Not Found",`Attribute named ${x.name} is not found!`));
                return false;
            }).
            map(x => { x.attributeDef = attributeRegistry.getAttribute(x.name); return x }).
            sort((a,b)=>b.attributeDef.Priority - a.attributeDef.Priority);

        for (let attributeDef of attributeDefinitions) {
            let attributeInstance = new attributeDef.attributeDef(element, attributeDef.value);
            attributeInstance.tagName = attributeDef.name;
            this.#attributes.push(attributeInstance);

            await attributeInstance.connectedCallback(element.scope);
        }
    }
}

class _connectedQueue {
    stack = [];
    currentPromise = null;
    addElement(element) {
        this.stack.push(element);
        this.loadNext();
    }

    loadNext() {
        if (!this.currentPromise && this.stack.length > 0) {
            this.currentPromise = this.stack[0].load();
            this.currentPromise.then(() => {
                this.stack.shift();
                this.currentPromise = null;
                this.loadNext();
            });
        }
    }
}
const connectedQueue = new _connectedQueue();

const exElement = (baseClass = HTMLElement) => {
    return class extends baseClass {
        /**
         * Object containing values assigned via ex-data attributes.
         * @type {object}
         */
        data = {}

        /**
         * Indicates if data bindings are simple bindings.
         * @type {object}
         */
        dataBindings = {}

        /**
         * Path to the HTML template of the element that should be loaded into the InnerHTML
         */
        templatePath = null

        /**
         * Indicates if the scope should inherit from it's parent, behave as a lexical scope.
         */
        shouldInheritScope = true;
        /**
         * If true a new scope will be created. If shouldInheritScope is true, a new scope will be created with the properties of the parent scope. Else an empty scope will be created.
         */
        shouldCreateNewScope = false;
        /**
        * If set to true, the element will be a virtual element. 
        * Virtual elements are removed from the DOM as soon as they are connected. When the "onConnected" method resolves, the children of the element is added in it's place.
        */
        isVirtual = false;
        /**
         * Element DOM operations.
         */
        DOM = {
            /**
             * Checks if the element is attached to the DOM
             * @returns true if the element is attached else false;
             */
            isAttached: () => {
                return detachedElementContainer.isAttached(this);
            },
            /**
             * Moves element instance to a container running in the background, allowing the element to run even while detached from the DOM.
             */
            persistInstance: () => {
                detachedElementContainer.addElement(this.parentElement, this);
            },
            /**
             * Removes the element from the DOM and replacing it with a comment. Comment is a bookmark to indicate where the element should be inserted when reattached.
             * @param {String} comment Bookmark comment. Can be anything.
             */
            detach: (comment = "Detached Element") => {
                detachedElementContainer.detach(this, comment);
            },
            /**
             * Attach the element to the DOM replacing the bookmark comment.
             */
            attach: () => {
                detachedElementContainer.attach(this);
            },
            /**
             * Replaces a detached element with another element.
             * @param {HTMLElement} replacement 
             */
            attachReplacement: (replacement) => {
                detachedElementContainer.attachReplacement(this, replacement);
            },
            /**
            * Replaces a detached element with another elements.
            * @param {Array<HTMLElement>} replacements 
            */
            attachReplacements: (replacements) => {
                detachedElementContainer.attachReplacements(this, replacements);
            }
        }

        /**
         *  System event when element attached to DOM 
         * @virtual
         */
        async onConnected() { }

        async load() {
            if (!this.isConnected) return;
            this._scope = this._scope ?? getComponentState(this);
            let originalInnerHtml = this.innerHTML;
            if (this.isVirtual) {
                this.innerHTML = "";
            }
            if (this.shouldCreateNewScope) {
                this.createScope(this.shouldCreateNewScope, this.shouldInheritScope);
            }            await this.attributeManager.connectedCallback(this);
            if (this.isVirtual) this.DOM.detach();
            await this.onConnected?.();
            if (this.templatePath) {
                await this.loadHTML(this.templatePath);
            }
            if (this.isVirtual) {
                this.innerHTML = originalInnerHtml;
                this.DOM.attachReplacements(Array.from(this.children));
            }        }
        /**
         * System event when element connected to DOM 
         * DO NOT OVERRIDE. Use onConnected instead.
         * @protected
         */
        async connectedCallback() {
            connectedQueue.addElement(this);
        }

        async loadHTML(url, targetElement) {
            if (url) {
                const response = await fetch(new Request(url));
                if (response.ok) {
                    let html = await response.text();
                    (targetElement ?? this).innerHTML = html;
                }
            }
        }

        /**
         *  System event when element disconnected from DOM 
         * @virtual
         */
        async onDisconnected() { }

        /**
         * System event when element disconnected to DOM 
         * DO NOT OVERRIDE. Use onDisconnected instead.
         * @protected
         */
        disconnectedCallback() {
            this.onDisconnected?.();
            this.attributeManager.disconnectedCallback(this);
            detachedElementContainer.parentDisconnected(this);
        }

        /** @protected*/
        get scope() { return this._scope = this._scope ?? getComponentState(this); } //fixed

        /** @protected*/
        set scope(value) { this._scope = value; } //fixed

        /** @protected */
        get attributeManager() { return this._attributeManager = this._attributeManager || new elementAttributeManager(); }

        /** @protected */
        set attributeManager(value) { this._attributeManager = value; }

        /** @protected */
        get hasScope() { return !!this._scope; } //fixed

        /** @protected */
        createScope(newScopeObjectInstance, shouldInheritScope, entriesToKeep = {}) {
            this._scope = newScopeObjectInstance ? new scope(shouldInheritScope ? ({ ...(this.scope?._target ?? {}) }) : entriesToKeep) : new scope(this.scope?._target ?? {});
        }
        /** @protected */
        getRootElement() {
            if (!this.data.shadow)
                return this;
            let result = this.attachShadow({ mode: "open" });
            result.scope = this.scope;
            return result;
        }
    }
};

class exInclude extends exElement(HTMLDivElement) {
    
    async onConnected() {
        if (!this.data.path) {
            throw 'No path value defined for include.';
        }
        this.loadHTML(this.data.path, this.getRootElement());
    }
}

function buildQuery(userQuery){
    var query = [];
    for (var key in userQuery) {
        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(userQuery[key]));
    }
    return (query.length ? '?' + query.join('&') : '');
}


function PostRequest(url, method, queryParameters, parameterObj, headers) {
    headers['Content-Type'] = 'application/json';
    let body = {};
    for (let key in parameterObj) {
        body = parameterObj[key];
    }
    url += buildQuery(queryParameters);
    return fetch(url, {
        method: method,
        mode: 'cors',
        body: JSON.stringify(body),
        headers: new Headers(headers)
    })
}
function GetRequest(url, method, parameters, headers) {
    headers['Content-Type'] = 'application/json';
    url += buildQuery(parameters);
    return fetch(url, {
        method: method,
        mode: 'cors',
        headers: new Headers(headers)
    });
}
const requestFunction = function (url, httpVerb = "GET") {
    return (queryParameters = {}, bodyParameters = {}, headers = {}) => {
        return new Promise((resolve, reject) => {
            var promiseCall = httpVerb == "POST" || httpVerb == "PUT" || httpVerb == "PATCH" ?
                PostRequest(url, httpVerb, queryParameters, bodyParameters, headers) :
                GetRequest(url, httpVerb, queryParameters, headers);

            promiseCall.then(async response => {
                response = await response.json();
                resolve(response);
            }).catch(error => {
                reject(error);
            });
        });
    };
};

class exRequest extends exElement(HTMLDivElement) {
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

customElements.define('ex-a', exElement(HTMLAnchorElement), { extends: "a" });
customElements.define('ex-abbr', exElement(HTMLElement), { extends: "abbr" });
customElements.define('ex-acronym', exElement(HTMLElement), { extends: "acronym" });
customElements.define('ex-address', exElement(HTMLElement), { extends: "address" });
customElements.define('ex-area', exElement(HTMLAreaElement), { extends: "area" });
customElements.define('ex-article', exElement(HTMLElement), { extends: "article" });
customElements.define('ex-aside', exElement(HTMLElement), { extends: "aside" });
customElements.define('ex-audio', exElement(HTMLAudioElement), { extends: "audio" });
customElements.define('ex-b', exElement(HTMLElement), { extends: "b" });
customElements.define('ex-base', exElement(HTMLBaseElement), { extends: "base" });
customElements.define('ex-basefont', exElement(HTMLElement), { extends: "basefont" });
customElements.define('ex-bdi', exElement(HTMLElement), { extends: "bdi" });
customElements.define('ex-bdo', exElement(HTMLElement), { extends: "bdo" });
customElements.define('ex-big', exElement(HTMLElement), { extends: "big" });
customElements.define('ex-blockquote', exElement(HTMLQuoteElement), { extends: "blockquote" });
customElements.define('ex-body', exElement(HTMLBodyElement), { extends: "body" });
customElements.define('ex-br', exElement(HTMLBRElement), { extends: "br" });
customElements.define('ex-button', exElement(HTMLButtonElement), { extends: "button" });
customElements.define('ex-canvas', exElement(HTMLCanvasElement), { extends: "canvas" });
customElements.define('ex-caption', exElement(HTMLTableCaptionElement), { extends: "caption" });
customElements.define('ex-center', exElement(HTMLElement), { extends: "center" });
customElements.define('ex-cite', exElement(HTMLElement), { extends: "cite" });
customElements.define('ex-code', exElement(HTMLElement), { extends: "code" });
customElements.define('ex-col', exElement(HTMLTableColElement), { extends: "col" });
customElements.define('ex-colgroup', exElement(HTMLTableColElement), { extends: "colgroup" });
customElements.define('ex-data', exElement(HTMLDataElement), { extends: "data" });
customElements.define('ex-datalist', exElement(HTMLDataListElement), { extends: "datalist" });
customElements.define('ex-dd', exElement(HTMLElement), { extends: "dd" });
customElements.define('ex-del', exElement(HTMLModElement), { extends: "del" });
customElements.define('ex-details', exElement(HTMLDetailsElement), { extends: "details" });
customElements.define('ex-dfn', exElement(HTMLElement), { extends: "dfn" });
customElements.define('ex-div', exElement(HTMLDivElement), { extends: "div" });
customElements.define('ex-dl', exElement(HTMLDListElement), { extends: "dl" });
customElements.define('ex-dt', exElement(HTMLElement), { extends: "dt" });
customElements.define('ex-em', exElement(HTMLElement), { extends: "em" });
customElements.define('ex-embed', exElement(HTMLEmbedElement), { extends: "embed" });
customElements.define('ex-fieldset', exElement(HTMLFieldSetElement), { extends: "fieldset" });
customElements.define('ex-figcaption', exElement(HTMLElement), { extends: "figcaption" });
customElements.define('ex-figure', exElement(HTMLElement), { extends: "figure" });
customElements.define('ex-font', exElement(HTMLFontElement), { extends: "font" });
customElements.define('ex-footer', exElement(HTMLElement), { extends: "footer" });
customElements.define('ex-form', exElement(HTMLFormElement), { extends: "form" });
customElements.define('ex-head', exElement(HTMLHeadElement), { extends: "head" });
customElements.define('ex-header', exElement(HTMLElement), { extends: "header" });
customElements.define('ex-hr', exElement(HTMLHRElement), { extends: "hr" });
customElements.define('ex-html', exElement(HTMLHtmlElement), { extends: "html" });
customElements.define('ex-i', exElement(HTMLElement), { extends: "i" });
customElements.define('ex-iframe', exElement(HTMLIFrameElement), { extends: "iframe" });
customElements.define('ex-img', exElement(HTMLImageElement), { extends: "img" });
customElements.define('ex-input', exElement(HTMLInputElement), { extends: "input" });
customElements.define('ex-ins', exElement(HTMLModElement), { extends: "ins" });
customElements.define('ex-kbd', exElement(HTMLElement), { extends: "kbd" });
customElements.define('ex-label', exElement(HTMLLabelElement), { extends: "label" });
customElements.define('ex-legend', exElement(HTMLLegendElement), { extends: "legend" });
customElements.define('ex-li', exElement(HTMLLIElement), { extends: "li" });
customElements.define('ex-link', exElement(HTMLLinkElement), { extends: "link" });
customElements.define('ex-main', exElement(HTMLElement), { extends: "main" });
customElements.define('ex-map', exElement(HTMLMapElement), { extends: "map" });
customElements.define('ex-mark', exElement(HTMLElement), { extends: "mark" });
customElements.define('ex-meta', exElement(HTMLMetaElement), { extends: "meta" });
customElements.define('ex-meter', exElement(HTMLMeterElement), { extends: "meter" });
customElements.define('ex-nav', exElement(HTMLElement), { extends: "nav" });
customElements.define('ex-noframes', exElement(HTMLElement), { extends: "noframes" });
customElements.define('ex-noscript', exElement(HTMLElement), { extends: "noscript" });
customElements.define('ex-object', exElement(HTMLObjectElement), { extends: "object" });
customElements.define('ex-ol', exElement(HTMLOListElement), { extends: "ol" });
customElements.define('ex-optgroup', exElement(HTMLOptGroupElement), { extends: "optgroup" });
customElements.define('ex-option', exElement(HTMLOptionElement), { extends: "option" });
customElements.define('ex-output', exElement(HTMLOutputElement), { extends: "output" });
customElements.define('ex-p', exElement(HTMLParagraphElement), { extends: "p" });
customElements.define('ex-picture', exElement(HTMLPictureElement), { extends: "picture" });
customElements.define('ex-pre', exElement(HTMLPreElement), { extends: "pre" });
customElements.define('ex-progress', exElement(HTMLProgressElement), { extends: "progress" });
customElements.define('ex-q', exElement(HTMLQuoteElement), { extends: "q" });
customElements.define('ex-rp', exElement(HTMLElement), { extends: "rp" });
customElements.define('ex-rt', exElement(HTMLElement), { extends: "rt" });
customElements.define('ex-ruby', exElement(HTMLElement), { extends: "ruby" });
customElements.define('ex-s', exElement(HTMLElement), { extends: "s" });
customElements.define('ex-samp', exElement(HTMLElement), { extends: "samp" });
customElements.define('ex-script', exElement(HTMLScriptElement), { extends: "script" });
customElements.define('ex-section', exElement(HTMLElement), { extends: "section" });
customElements.define('ex-select', exElement(HTMLSelectElement), { extends: "select" });
customElements.define('ex-small', exElement(HTMLElement), { extends: "small" });
customElements.define('ex-source', exElement(HTMLSourceElement), { extends: "source" });
customElements.define('ex-span', exElement(HTMLSpanElement), { extends: "span" });
customElements.define('ex-strike', exElement(HTMLElement), { extends: "strike" });
customElements.define('ex-strong', exElement(HTMLElement), { extends: "strong" });
customElements.define('ex-style', exElement(HTMLStyleElement), { extends: "style" });
customElements.define('ex-sub', exElement(HTMLElement), { extends: "sub" });
customElements.define('ex-summary', exElement(HTMLElement), { extends: "summary" });
customElements.define('ex-sup', exElement(HTMLElement), { extends: "sup" });
customElements.define('ex-table', exElement(HTMLTableElement), { extends: "table" });
customElements.define('ex-tbody', exElement(HTMLTableSectionElement), { extends: "tbody" });
customElements.define('ex-td', exElement(HTMLTableCellElement), { extends: "td" });
customElements.define('ex-template', exElement(HTMLTemplateElement), { extends: "template" });
customElements.define('ex-textarea', exElement(HTMLTextAreaElement), { extends: "textarea" });
customElements.define('ex-tfoot', exElement(HTMLTableSectionElement), { extends: "tfoot" });
customElements.define('ex-th', exElement(HTMLTableCellElement), { extends: "th" });
customElements.define('ex-thead', exElement(HTMLTableSectionElement), { extends: "thead" });
customElements.define('ex-time', exElement(HTMLTimeElement), { extends: "time" });
customElements.define('ex-title', exElement(HTMLTitleElement), { extends: "title" });
customElements.define('ex-tr', exElement(HTMLTableRowElement), { extends: "tr" });
customElements.define('ex-track', exElement(HTMLTrackElement), { extends: "track" });
customElements.define('ex-tt', exElement(HTMLElement), { extends: "tt" });
customElements.define('ex-u', exElement(HTMLElement), { extends: "u" });
customElements.define('ex-ul', exElement(HTMLUListElement), { extends: "ul" });
customElements.define('ex-var', exElement(HTMLElement), { extends: "var" });
customElements.define('ex-video', exElement(HTMLVideoElement), { extends: "video" });
customElements.define('ex-wbr', exElement(HTMLElement), { extends: "wbr" });

customElements.define("ex-include", exInclude, { extends: "div" });
customElements.define("ex-request", exRequest, { extends: "div" });

var customElements$1 = customElements;

export { attributeRegistry, customElements$1 as elementRegistry, exAttribute, exElement, customElements$1 as stateManager };
