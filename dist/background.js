var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/isomorphic-form-data/lib/browser.js
var require_browser = __commonJS({
  "node_modules/isomorphic-form-data/lib/browser.js"(exports, module) {
    module.exports = self.FormData;
  }
});

// node_modules/cross-fetch/dist/browser-ponyfill.js
var require_browser_ponyfill = __commonJS({
  "node_modules/cross-fetch/dist/browser-ponyfill.js"(exports, module) {
    var global = typeof self !== "undefined" ? self : exports;
    var __self__ = function() {
      function F() {
        this.fetch = false;
        this.DOMException = global.DOMException;
      }
      F.prototype = global;
      return new F();
    }();
    (function(self2) {
      var irrelevant = function(exports2) {
        var support = {
          searchParams: "URLSearchParams" in self2,
          iterable: "Symbol" in self2 && "iterator" in Symbol,
          blob: "FileReader" in self2 && "Blob" in self2 && function() {
            try {
              new Blob();
              return true;
            } catch (e) {
              return false;
            }
          }(),
          formData: "FormData" in self2,
          arrayBuffer: "ArrayBuffer" in self2
        };
        function isDataView(obj) {
          return obj && DataView.prototype.isPrototypeOf(obj);
        }
        if (support.arrayBuffer) {
          var viewClasses = [
            "[object Int8Array]",
            "[object Uint8Array]",
            "[object Uint8ClampedArray]",
            "[object Int16Array]",
            "[object Uint16Array]",
            "[object Int32Array]",
            "[object Uint32Array]",
            "[object Float32Array]",
            "[object Float64Array]"
          ];
          var isArrayBufferView = ArrayBuffer.isView || function(obj) {
            return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1;
          };
        }
        function normalizeName(name) {
          if (typeof name !== "string") {
            name = String(name);
          }
          if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
            throw new TypeError("Invalid character in header field name");
          }
          return name.toLowerCase();
        }
        function normalizeValue(value) {
          if (typeof value !== "string") {
            value = String(value);
          }
          return value;
        }
        function iteratorFor(items) {
          var iterator = {
            next: function() {
              var value = items.shift();
              return { done: value === void 0, value };
            }
          };
          if (support.iterable) {
            iterator[Symbol.iterator] = function() {
              return iterator;
            };
          }
          return iterator;
        }
        function Headers(headers) {
          this.map = {};
          if (headers instanceof Headers) {
            headers.forEach(function(value, name) {
              this.append(name, value);
            }, this);
          } else if (Array.isArray(headers)) {
            headers.forEach(function(header) {
              this.append(header[0], header[1]);
            }, this);
          } else if (headers) {
            Object.getOwnPropertyNames(headers).forEach(function(name) {
              this.append(name, headers[name]);
            }, this);
          }
        }
        Headers.prototype.append = function(name, value) {
          name = normalizeName(name);
          value = normalizeValue(value);
          var oldValue = this.map[name];
          this.map[name] = oldValue ? oldValue + ", " + value : value;
        };
        Headers.prototype["delete"] = function(name) {
          delete this.map[normalizeName(name)];
        };
        Headers.prototype.get = function(name) {
          name = normalizeName(name);
          return this.has(name) ? this.map[name] : null;
        };
        Headers.prototype.has = function(name) {
          return this.map.hasOwnProperty(normalizeName(name));
        };
        Headers.prototype.set = function(name, value) {
          this.map[normalizeName(name)] = normalizeValue(value);
        };
        Headers.prototype.forEach = function(callback, thisArg) {
          for (var name in this.map) {
            if (this.map.hasOwnProperty(name)) {
              callback.call(thisArg, this.map[name], name, this);
            }
          }
        };
        Headers.prototype.keys = function() {
          var items = [];
          this.forEach(function(value, name) {
            items.push(name);
          });
          return iteratorFor(items);
        };
        Headers.prototype.values = function() {
          var items = [];
          this.forEach(function(value) {
            items.push(value);
          });
          return iteratorFor(items);
        };
        Headers.prototype.entries = function() {
          var items = [];
          this.forEach(function(value, name) {
            items.push([name, value]);
          });
          return iteratorFor(items);
        };
        if (support.iterable) {
          Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
        }
        function consumed(body) {
          if (body.bodyUsed) {
            return Promise.reject(new TypeError("Already read"));
          }
          body.bodyUsed = true;
        }
        function fileReaderReady(reader) {
          return new Promise(function(resolve, reject) {
            reader.onload = function() {
              resolve(reader.result);
            };
            reader.onerror = function() {
              reject(reader.error);
            };
          });
        }
        function readBlobAsArrayBuffer(blob) {
          var reader = new FileReader();
          var promise = fileReaderReady(reader);
          reader.readAsArrayBuffer(blob);
          return promise;
        }
        function readBlobAsText(blob) {
          var reader = new FileReader();
          var promise = fileReaderReady(reader);
          reader.readAsText(blob);
          return promise;
        }
        function readArrayBufferAsText(buf) {
          var view = new Uint8Array(buf);
          var chars = new Array(view.length);
          for (var i = 0; i < view.length; i++) {
            chars[i] = String.fromCharCode(view[i]);
          }
          return chars.join("");
        }
        function bufferClone(buf) {
          if (buf.slice) {
            return buf.slice(0);
          } else {
            var view = new Uint8Array(buf.byteLength);
            view.set(new Uint8Array(buf));
            return view.buffer;
          }
        }
        function Body() {
          this.bodyUsed = false;
          this._initBody = function(body) {
            this._bodyInit = body;
            if (!body) {
              this._bodyText = "";
            } else if (typeof body === "string") {
              this._bodyText = body;
            } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
              this._bodyBlob = body;
            } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
              this._bodyFormData = body;
            } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
              this._bodyText = body.toString();
            } else if (support.arrayBuffer && support.blob && isDataView(body)) {
              this._bodyArrayBuffer = bufferClone(body.buffer);
              this._bodyInit = new Blob([this._bodyArrayBuffer]);
            } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
              this._bodyArrayBuffer = bufferClone(body);
            } else {
              this._bodyText = body = Object.prototype.toString.call(body);
            }
            if (!this.headers.get("content-type")) {
              if (typeof body === "string") {
                this.headers.set("content-type", "text/plain;charset=UTF-8");
              } else if (this._bodyBlob && this._bodyBlob.type) {
                this.headers.set("content-type", this._bodyBlob.type);
              } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
                this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8");
              }
            }
          };
          if (support.blob) {
            this.blob = function() {
              var rejected = consumed(this);
              if (rejected) {
                return rejected;
              }
              if (this._bodyBlob) {
                return Promise.resolve(this._bodyBlob);
              } else if (this._bodyArrayBuffer) {
                return Promise.resolve(new Blob([this._bodyArrayBuffer]));
              } else if (this._bodyFormData) {
                throw new Error("could not read FormData body as blob");
              } else {
                return Promise.resolve(new Blob([this._bodyText]));
              }
            };
            this.arrayBuffer = function() {
              if (this._bodyArrayBuffer) {
                return consumed(this) || Promise.resolve(this._bodyArrayBuffer);
              } else {
                return this.blob().then(readBlobAsArrayBuffer);
              }
            };
          }
          this.text = function() {
            var rejected = consumed(this);
            if (rejected) {
              return rejected;
            }
            if (this._bodyBlob) {
              return readBlobAsText(this._bodyBlob);
            } else if (this._bodyArrayBuffer) {
              return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer));
            } else if (this._bodyFormData) {
              throw new Error("could not read FormData body as text");
            } else {
              return Promise.resolve(this._bodyText);
            }
          };
          if (support.formData) {
            this.formData = function() {
              return this.text().then(decode);
            };
          }
          this.json = function() {
            return this.text().then(JSON.parse);
          };
          return this;
        }
        var methods = ["DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT"];
        function normalizeMethod(method) {
          var upcased = method.toUpperCase();
          return methods.indexOf(upcased) > -1 ? upcased : method;
        }
        function Request(input, options) {
          options = options || {};
          var body = options.body;
          if (input instanceof Request) {
            if (input.bodyUsed) {
              throw new TypeError("Already read");
            }
            this.url = input.url;
            this.credentials = input.credentials;
            if (!options.headers) {
              this.headers = new Headers(input.headers);
            }
            this.method = input.method;
            this.mode = input.mode;
            this.signal = input.signal;
            if (!body && input._bodyInit != null) {
              body = input._bodyInit;
              input.bodyUsed = true;
            }
          } else {
            this.url = String(input);
          }
          this.credentials = options.credentials || this.credentials || "same-origin";
          if (options.headers || !this.headers) {
            this.headers = new Headers(options.headers);
          }
          this.method = normalizeMethod(options.method || this.method || "GET");
          this.mode = options.mode || this.mode || null;
          this.signal = options.signal || this.signal;
          this.referrer = null;
          if ((this.method === "GET" || this.method === "HEAD") && body) {
            throw new TypeError("Body not allowed for GET or HEAD requests");
          }
          this._initBody(body);
        }
        Request.prototype.clone = function() {
          return new Request(this, { body: this._bodyInit });
        };
        function decode(body) {
          var form = new FormData();
          body.trim().split("&").forEach(function(bytes) {
            if (bytes) {
              var split = bytes.split("=");
              var name = split.shift().replace(/\+/g, " ");
              var value = split.join("=").replace(/\+/g, " ");
              form.append(decodeURIComponent(name), decodeURIComponent(value));
            }
          });
          return form;
        }
        function parseHeaders(rawHeaders) {
          var headers = new Headers();
          var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, " ");
          preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
            var parts = line.split(":");
            var key = parts.shift().trim();
            if (key) {
              var value = parts.join(":").trim();
              headers.append(key, value);
            }
          });
          return headers;
        }
        Body.call(Request.prototype);
        function Response(bodyInit, options) {
          if (!options) {
            options = {};
          }
          this.type = "default";
          this.status = options.status === void 0 ? 200 : options.status;
          this.ok = this.status >= 200 && this.status < 300;
          this.statusText = "statusText" in options ? options.statusText : "OK";
          this.headers = new Headers(options.headers);
          this.url = options.url || "";
          this._initBody(bodyInit);
        }
        Body.call(Response.prototype);
        Response.prototype.clone = function() {
          return new Response(this._bodyInit, {
            status: this.status,
            statusText: this.statusText,
            headers: new Headers(this.headers),
            url: this.url
          });
        };
        Response.error = function() {
          var response = new Response(null, { status: 0, statusText: "" });
          response.type = "error";
          return response;
        };
        var redirectStatuses = [301, 302, 303, 307, 308];
        Response.redirect = function(url, status) {
          if (redirectStatuses.indexOf(status) === -1) {
            throw new RangeError("Invalid status code");
          }
          return new Response(null, { status, headers: { location: url } });
        };
        exports2.DOMException = self2.DOMException;
        try {
          new exports2.DOMException();
        } catch (err) {
          exports2.DOMException = function(message, name) {
            this.message = message;
            this.name = name;
            var error = Error(message);
            this.stack = error.stack;
          };
          exports2.DOMException.prototype = Object.create(Error.prototype);
          exports2.DOMException.prototype.constructor = exports2.DOMException;
        }
        function fetch2(input, init) {
          return new Promise(function(resolve, reject) {
            var request = new Request(input, init);
            if (request.signal && request.signal.aborted) {
              return reject(new exports2.DOMException("Aborted", "AbortError"));
            }
            var xhr = new XMLHttpRequest();
            function abortXhr() {
              xhr.abort();
            }
            xhr.onload = function() {
              var options = {
                status: xhr.status,
                statusText: xhr.statusText,
                headers: parseHeaders(xhr.getAllResponseHeaders() || "")
              };
              options.url = "responseURL" in xhr ? xhr.responseURL : options.headers.get("X-Request-URL");
              var body = "response" in xhr ? xhr.response : xhr.responseText;
              resolve(new Response(body, options));
            };
            xhr.onerror = function() {
              reject(new TypeError("Network request failed"));
            };
            xhr.ontimeout = function() {
              reject(new TypeError("Network request failed"));
            };
            xhr.onabort = function() {
              reject(new exports2.DOMException("Aborted", "AbortError"));
            };
            xhr.open(request.method, request.url, true);
            if (request.credentials === "include") {
              xhr.withCredentials = true;
            } else if (request.credentials === "omit") {
              xhr.withCredentials = false;
            }
            if ("responseType" in xhr && support.blob) {
              xhr.responseType = "blob";
            }
            request.headers.forEach(function(value, name) {
              xhr.setRequestHeader(name, value);
            });
            if (request.signal) {
              request.signal.addEventListener("abort", abortXhr);
              xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                  request.signal.removeEventListener("abort", abortXhr);
                }
              };
            }
            xhr.send(typeof request._bodyInit === "undefined" ? null : request._bodyInit);
          });
        }
        fetch2.polyfill = true;
        if (!self2.fetch) {
          self2.fetch = fetch2;
          self2.Headers = Headers;
          self2.Request = Request;
          self2.Response = Response;
        }
        exports2.Headers = Headers;
        exports2.Request = Request;
        exports2.Response = Response;
        exports2.fetch = fetch2;
        Object.defineProperty(exports2, "__esModule", { value: true });
        return exports2;
      }({});
    })(__self__);
    __self__.fetch.ponyfill = true;
    delete __self__.fetch.polyfill;
    var ctx = __self__;
    exports = ctx.fetch;
    exports.default = ctx.fetch;
    exports.fetch = ctx.fetch;
    exports.Headers = ctx.Headers;
    exports.Request = ctx.Request;
    exports.Response = ctx.Response;
    module.exports = exports;
  }
});

// node_modules/appwrite/dist/esm/sdk.js
var import_isomorphic_form_data = __toESM(require_browser(), 1);
var import_cross_fetch = __toESM(require_browser_ponyfill(), 1);
function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}
var Service = class {
  constructor(client2) {
    this.client = client2;
  }
  static flatten(data, prefix = "") {
    let output = {};
    for (const key in data) {
      let value = data[key];
      let finalKey = prefix ? `${prefix}[${key}]` : key;
      if (Array.isArray(value)) {
        output = Object.assign(output, this.flatten(value, finalKey));
      } else {
        output[finalKey] = value;
      }
    }
    return output;
  }
};
Service.CHUNK_SIZE = 5 * 1024 * 1024;
var Query = class {
};
Query.equal = (attribute, value) => Query.addQuery(attribute, "equal", value);
Query.notEqual = (attribute, value) => Query.addQuery(attribute, "notEqual", value);
Query.lessThan = (attribute, value) => Query.addQuery(attribute, "lessThan", value);
Query.lessThanEqual = (attribute, value) => Query.addQuery(attribute, "lessThanEqual", value);
Query.greaterThan = (attribute, value) => Query.addQuery(attribute, "greaterThan", value);
Query.greaterThanEqual = (attribute, value) => Query.addQuery(attribute, "greaterThanEqual", value);
Query.isNull = (attribute) => `isNull("${attribute}")`;
Query.isNotNull = (attribute) => `isNotNull("${attribute}")`;
Query.between = (attribute, start, end) => `between("${attribute}", ${Query.parseValues(start)}, ${Query.parseValues(end)})`;
Query.startsWith = (attribute, value) => Query.addQuery(attribute, "startsWith", value);
Query.endsWith = (attribute, value) => Query.addQuery(attribute, "endsWith", value);
Query.select = (attributes) => `select([${attributes.map((attr) => `"${attr}"`).join(",")}])`;
Query.search = (attribute, value) => Query.addQuery(attribute, "search", value);
Query.orderDesc = (attribute) => `orderDesc("${attribute}")`;
Query.orderAsc = (attribute) => `orderAsc("${attribute}")`;
Query.cursorAfter = (documentId) => `cursorAfter("${documentId}")`;
Query.cursorBefore = (documentId) => `cursorBefore("${documentId}")`;
Query.limit = (limit) => `limit(${limit})`;
Query.offset = (offset) => `offset(${offset})`;
Query.addQuery = (attribute, method, value) => value instanceof Array ? `${method}("${attribute}", [${value.map((v) => Query.parseValues(v)).join(",")}])` : `${method}("${attribute}", [${Query.parseValues(value)}])`;
Query.parseValues = (value) => typeof value === "string" || value instanceof String ? `"${value}"` : `${value}`;
var AppwriteException = class extends Error {
  constructor(message, code = 0, type = "", response = "") {
    super(message);
    this.name = "AppwriteException";
    this.message = message;
    this.code = code;
    this.type = type;
    this.response = response;
  }
};
var Client = class {
  constructor() {
    this.config = {
      endpoint: "https://HOSTNAME/v1",
      endpointRealtime: "",
      project: "",
      jwt: "",
      locale: ""
    };
    this.headers = {
      "x-sdk-name": "Web",
      "x-sdk-platform": "client",
      "x-sdk-language": "web",
      "x-sdk-version": "13.0.2",
      "X-Appwrite-Response-Format": "1.4.0"
    };
    this.realtime = {
      socket: void 0,
      timeout: void 0,
      url: "",
      channels: /* @__PURE__ */ new Set(),
      subscriptions: /* @__PURE__ */ new Map(),
      subscriptionsCounter: 0,
      reconnect: true,
      reconnectAttempts: 0,
      lastMessage: void 0,
      connect: () => {
        clearTimeout(this.realtime.timeout);
        this.realtime.timeout = self === null || self === void 0 ? void 0 : self.setTimeout(() => {
          this.realtime.createSocket();
        }, 50);
      },
      getTimeout: () => {
        switch (true) {
          case this.realtime.reconnectAttempts < 5:
            return 1e3;
          case this.realtime.reconnectAttempts < 15:
            return 5e3;
          case this.realtime.reconnectAttempts < 100:
            return 1e4;
          default:
            return 6e4;
        }
      },
      createSocket: () => {
        var _a, _b;
        if (this.realtime.channels.size < 1)
          return;
        const channels = new URLSearchParams();
        channels.set("project", this.config.project);
        this.realtime.channels.forEach((channel) => {
          channels.append("channels[]", channel);
        });
        const url = this.config.endpointRealtime + "/realtime?" + channels.toString();
        if (url !== this.realtime.url || // Check if URL is present
        !this.realtime.socket || // Check if WebSocket has not been created
        ((_a = this.realtime.socket) === null || _a === void 0 ? void 0 : _a.readyState) > WebSocket.OPEN) {
          if (this.realtime.socket && ((_b = this.realtime.socket) === null || _b === void 0 ? void 0 : _b.readyState) < WebSocket.CLOSING) {
            this.realtime.reconnect = false;
            this.realtime.socket.close();
          }
          this.realtime.url = url;
          this.realtime.socket = new WebSocket(url);
          this.realtime.socket.addEventListener("message", this.realtime.onMessage);
          this.realtime.socket.addEventListener("open", (_event) => {
            this.realtime.reconnectAttempts = 0;
          });
          this.realtime.socket.addEventListener("close", (event) => {
            var _a2, _b2, _c;
            if (!this.realtime.reconnect || ((_b2 = (_a2 = this.realtime) === null || _a2 === void 0 ? void 0 : _a2.lastMessage) === null || _b2 === void 0 ? void 0 : _b2.type) === "error" && // Check if last message was of type error
            ((_c = this.realtime) === null || _c === void 0 ? void 0 : _c.lastMessage.data).code === 1008) {
              this.realtime.reconnect = true;
              return;
            }
            const timeout = this.realtime.getTimeout();
            console.error(`Realtime got disconnected. Reconnect will be attempted in ${timeout / 1e3} seconds.`, event.reason);
            setTimeout(() => {
              this.realtime.reconnectAttempts++;
              this.realtime.createSocket();
            }, timeout);
          });
        }
      },
      onMessage: (event) => {
        var _a, _b;
        try {
          const message = JSON.parse(event.data);
          this.realtime.lastMessage = message;
          switch (message.type) {
            case "connected":
              const cookie = JSON.parse((_a = self.localStorage.getItem("cookieFallback")) !== null && _a !== void 0 ? _a : "{}");
              const session = cookie === null || cookie === void 0 ? void 0 : cookie[`a_session_${this.config.project}`];
              const messageData = message.data;
              if (session && !messageData.user) {
                (_b = this.realtime.socket) === null || _b === void 0 ? void 0 : _b.send(JSON.stringify({
                  type: "authentication",
                  data: {
                    session
                  }
                }));
              }
              break;
            case "event":
              let data = message.data;
              if (data === null || data === void 0 ? void 0 : data.channels) {
                const isSubscribed = data.channels.some((channel) => this.realtime.channels.has(channel));
                if (!isSubscribed)
                  return;
                this.realtime.subscriptions.forEach((subscription) => {
                  if (data.channels.some((channel) => subscription.channels.includes(channel))) {
                    setTimeout(() => subscription.callback(data));
                  }
                });
              }
              break;
            case "error":
              throw message.data;
            default:
              break;
          }
        } catch (e) {
          console.error(e);
        }
      },
      cleanUp: (channels) => {
        this.realtime.channels.forEach((channel) => {
          if (channels.includes(channel)) {
            let found = Array.from(this.realtime.subscriptions).some(([_key, subscription]) => {
              return subscription.channels.includes(channel);
            });
            if (!found) {
              this.realtime.channels.delete(channel);
            }
          }
        });
      }
    };
  }
  /**
   * Set Endpoint
   *
   * Your project endpoint
   *
   * @param {string} endpoint
   *
   * @returns {this}
   */
  setEndpoint(endpoint) {
    this.config.endpoint = endpoint;
    this.config.endpointRealtime = this.config.endpointRealtime || this.config.endpoint.replace("https://", "wss://").replace("http://", "ws://");
    return this;
  }
  /**
   * Set Realtime Endpoint
   *
   * @param {string} endpointRealtime
   *
   * @returns {this}
   */
  setEndpointRealtime(endpointRealtime) {
    this.config.endpointRealtime = endpointRealtime;
    return this;
  }
  /**
   * Set Project
   *
   * Your project ID
   *
   * @param value string
   *
   * @return {this}
   */
  setProject(value) {
    this.headers["X-Appwrite-Project"] = value;
    this.config.project = value;
    return this;
  }
  /**
   * Set JWT
   *
   * Your secret JSON Web Token
   *
   * @param value string
   *
   * @return {this}
   */
  setJWT(value) {
    this.headers["X-Appwrite-JWT"] = value;
    this.config.jwt = value;
    return this;
  }
  /**
   * Set Locale
   *
   * @param value string
   *
   * @return {this}
   */
  setLocale(value) {
    this.headers["X-Appwrite-Locale"] = value;
    this.config.locale = value;
    return this;
  }
  /**
   * Subscribes to Appwrite events and passes you the payload in realtime.
   *
   * @param {string|string[]} channels
   * Channel to subscribe - pass a single channel as a string or multiple with an array of strings.
   *
   * Possible channels are:
   * - account
   * - collections
   * - collections.[ID]
   * - collections.[ID].documents
   * - documents
   * - documents.[ID]
   * - files
   * - files.[ID]
   * - executions
   * - executions.[ID]
   * - functions.[ID]
   * - teams
   * - teams.[ID]
   * - memberships
   * - memberships.[ID]
   * @param {(payload: RealtimeMessage) => void} callback Is called on every realtime update.
   * @returns {() => void} Unsubscribes from events.
   */
  subscribe(channels, callback) {
    let channelArray = typeof channels === "string" ? [channels] : channels;
    channelArray.forEach((channel) => this.realtime.channels.add(channel));
    const counter = this.realtime.subscriptionsCounter++;
    this.realtime.subscriptions.set(counter, {
      channels: channelArray,
      callback
    });
    this.realtime.connect();
    return () => {
      this.realtime.subscriptions.delete(counter);
      this.realtime.cleanUp(channelArray);
      this.realtime.connect();
    };
  }
  call(method, url, headers = {}, params = {}) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
      method = method.toUpperCase();
      headers = Object.assign({}, this.headers, headers);
      let options = {
        method,
        headers,
        credentials: "include"
      };
      if (typeof self !== "undefined" && self.localStorage) {
        headers["X-Fallback-Cookies"] = (_a = self.localStorage.getItem("cookieFallback")) !== null && _a !== void 0 ? _a : "";
      }
      if (method === "GET") {
        for (const [key, value] of Object.entries(Service.flatten(params))) {
          url.searchParams.append(key, value);
        }
      } else {
        switch (headers["content-type"]) {
          case "application/json":
            options.body = JSON.stringify(params);
            break;
          case "multipart/form-data":
            let formData = new FormData();
            for (const key in params) {
              if (Array.isArray(params[key])) {
                params[key].forEach((value) => {
                  formData.append(key + "[]", value);
                });
              } else {
                formData.append(key, params[key]);
              }
            }
            options.body = formData;
            delete headers["content-type"];
            break;
        }
      }
      try {
        let data = null;
        const response = yield (0, import_cross_fetch.fetch)(url.toString(), options);
        if ((_b = response.headers.get("content-type")) === null || _b === void 0 ? void 0 : _b.includes("application/json")) {
          data = yield response.json();
        } else {
          data = {
            message: yield response.text()
          };
        }
        if (400 <= response.status) {
          throw new AppwriteException(data === null || data === void 0 ? void 0 : data.message, response.status, data === null || data === void 0 ? void 0 : data.type, data);
        }
        const cookieFallback = response.headers.get("X-Fallback-Cookies");
        if (typeof self !== "undefined" && self.localStorage && cookieFallback) {
          self.console.warn("Appwrite is using localStorage for session management. Increase your security by adding a custom domain as your API endpoint.");
          self.localStorage.setItem("cookieFallback", cookieFallback);
        }
        return data;
      } catch (e) {
        if (e instanceof AppwriteException) {
          throw e;
        }
        throw new AppwriteException(e.message);
      }
    });
  }
};
var Account = class extends Service {
  constructor(client2) {
    super(client2);
  }
  /**
   * Get account
   *
   * Get the currently logged in user.
   *
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  get() {
    return __awaiter(this, void 0, void 0, function* () {
      const apiPath = "/account";
      const payload = {};
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("get", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Create account
   *
   * Use this endpoint to allow a new user to register a new account in your
   * project. After the user registration completes successfully, you can use
   * the
   * [/account/verfication](https://appwrite.io/docs/references/cloud/client-web/account#createVerification)
   * route to start verifying the user email address. To allow the new user to
   * login to their new account, you need to create a new [account
   * session](https://appwrite.io/docs/references/cloud/client-web/account#createEmailSession).
   *
   * @param {string} userId
   * @param {string} email
   * @param {string} password
   * @param {string} name
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  create(userId, email, password, name) {
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof userId === "undefined") {
        throw new AppwriteException('Missing required parameter: "userId"');
      }
      if (typeof email === "undefined") {
        throw new AppwriteException('Missing required parameter: "email"');
      }
      if (typeof password === "undefined") {
        throw new AppwriteException('Missing required parameter: "password"');
      }
      const apiPath = "/account";
      const payload = {};
      if (typeof userId !== "undefined") {
        payload["userId"] = userId;
      }
      if (typeof email !== "undefined") {
        payload["email"] = email;
      }
      if (typeof password !== "undefined") {
        payload["password"] = password;
      }
      if (typeof name !== "undefined") {
        payload["name"] = name;
      }
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("post", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Update email
   *
   * Update currently logged in user account email address. After changing user
   * address, the user confirmation status will get reset. A new confirmation
   * email is not sent automatically however you can use the send confirmation
   * email endpoint again to send the confirmation email. For security measures,
   * user password is required to complete this request.
   * This endpoint can also be used to convert an anonymous account to a normal
   * one, by passing an email address and a new password.
   *
   *
   * @param {string} email
   * @param {string} password
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  updateEmail(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof email === "undefined") {
        throw new AppwriteException('Missing required parameter: "email"');
      }
      if (typeof password === "undefined") {
        throw new AppwriteException('Missing required parameter: "password"');
      }
      const apiPath = "/account/email";
      const payload = {};
      if (typeof email !== "undefined") {
        payload["email"] = email;
      }
      if (typeof password !== "undefined") {
        payload["password"] = password;
      }
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("patch", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * List Identities
   *
   * Get the list of identities for the currently logged in user.
   *
   * @param {string} queries
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  listIdentities(queries) {
    return __awaiter(this, void 0, void 0, function* () {
      const apiPath = "/account/identities";
      const payload = {};
      if (typeof queries !== "undefined") {
        payload["queries"] = queries;
      }
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("get", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Delete Identity
   *
   * Delete an identity by its unique ID.
   *
   * @param {string} identityId
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  deleteIdentity(identityId) {
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof identityId === "undefined") {
        throw new AppwriteException('Missing required parameter: "identityId"');
      }
      const apiPath = "/account/identities/{identityId}".replace("{identityId}", identityId);
      const payload = {};
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("delete", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Create JWT
   *
   * Use this endpoint to create a JSON Web Token. You can use the resulting JWT
   * to authenticate on behalf of the current user when working with the
   * Appwrite server-side API and SDKs. The JWT secret is valid for 15 minutes
   * from its creation and will be invalid if the user will logout in that time
   * frame.
   *
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  createJWT() {
    return __awaiter(this, void 0, void 0, function* () {
      const apiPath = "/account/jwt";
      const payload = {};
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("post", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * List logs
   *
   * Get the list of latest security activity logs for the currently logged in
   * user. Each log returns user IP address, location and date and time of log.
   *
   * @param {string[]} queries
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  listLogs(queries) {
    return __awaiter(this, void 0, void 0, function* () {
      const apiPath = "/account/logs";
      const payload = {};
      if (typeof queries !== "undefined") {
        payload["queries"] = queries;
      }
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("get", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Update name
   *
   * Update currently logged in user account name.
   *
   * @param {string} name
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  updateName(name) {
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof name === "undefined") {
        throw new AppwriteException('Missing required parameter: "name"');
      }
      const apiPath = "/account/name";
      const payload = {};
      if (typeof name !== "undefined") {
        payload["name"] = name;
      }
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("patch", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Update password
   *
   * Update currently logged in user password. For validation, user is required
   * to pass in the new password, and the old password. For users created with
   * OAuth, Team Invites and Magic URL, oldPassword is optional.
   *
   * @param {string} password
   * @param {string} oldPassword
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  updatePassword(password, oldPassword) {
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof password === "undefined") {
        throw new AppwriteException('Missing required parameter: "password"');
      }
      const apiPath = "/account/password";
      const payload = {};
      if (typeof password !== "undefined") {
        payload["password"] = password;
      }
      if (typeof oldPassword !== "undefined") {
        payload["oldPassword"] = oldPassword;
      }
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("patch", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Update phone
   *
   * Update the currently logged in user's phone number. After updating the
   * phone number, the phone verification status will be reset. A confirmation
   * SMS is not sent automatically, however you can use the [POST
   * /account/verification/phone](https://appwrite.io/docs/references/cloud/client-web/account#createPhoneVerification)
   * endpoint to send a confirmation SMS.
   *
   * @param {string} phone
   * @param {string} password
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  updatePhone(phone, password) {
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof phone === "undefined") {
        throw new AppwriteException('Missing required parameter: "phone"');
      }
      if (typeof password === "undefined") {
        throw new AppwriteException('Missing required parameter: "password"');
      }
      const apiPath = "/account/phone";
      const payload = {};
      if (typeof phone !== "undefined") {
        payload["phone"] = phone;
      }
      if (typeof password !== "undefined") {
        payload["password"] = password;
      }
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("patch", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Get account preferences
   *
   * Get the preferences as a key-value object for the currently logged in user.
   *
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  getPrefs() {
    return __awaiter(this, void 0, void 0, function* () {
      const apiPath = "/account/prefs";
      const payload = {};
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("get", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Update preferences
   *
   * Update currently logged in user account preferences. The object you pass is
   * stored as is, and replaces any previous value. The maximum allowed prefs
   * size is 64kB and throws error if exceeded.
   *
   * @param {Partial<Preferences>} prefs
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  updatePrefs(prefs) {
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof prefs === "undefined") {
        throw new AppwriteException('Missing required parameter: "prefs"');
      }
      const apiPath = "/account/prefs";
      const payload = {};
      if (typeof prefs !== "undefined") {
        payload["prefs"] = prefs;
      }
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("patch", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Create password recovery
   *
   * Sends the user an email with a temporary secret key for password reset.
   * When the user clicks the confirmation link he is redirected back to your
   * app password reset URL with the secret key and email address values
   * attached to the URL query string. Use the query string params to submit a
   * request to the [PUT
   * /account/recovery](https://appwrite.io/docs/references/cloud/client-web/account#updateRecovery)
   * endpoint to complete the process. The verification link sent to the user's
   * email address is valid for 1 hour.
   *
   * @param {string} email
   * @param {string} url
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  createRecovery(email, url) {
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof email === "undefined") {
        throw new AppwriteException('Missing required parameter: "email"');
      }
      if (typeof url === "undefined") {
        throw new AppwriteException('Missing required parameter: "url"');
      }
      const apiPath = "/account/recovery";
      const payload = {};
      if (typeof email !== "undefined") {
        payload["email"] = email;
      }
      if (typeof url !== "undefined") {
        payload["url"] = url;
      }
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("post", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Create password recovery (confirmation)
   *
   * Use this endpoint to complete the user account password reset. Both the
   * **userId** and **secret** arguments will be passed as query parameters to
   * the redirect URL you have provided when sending your request to the [POST
   * /account/recovery](https://appwrite.io/docs/references/cloud/client-web/account#createRecovery)
   * endpoint.
   *
   * Please note that in order to avoid a [Redirect
   * Attack](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.md)
   * the only valid redirect URLs are the ones from domains you have set when
   * adding your platforms in the console interface.
   *
   * @param {string} userId
   * @param {string} secret
   * @param {string} password
   * @param {string} passwordAgain
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  updateRecovery(userId, secret, password, passwordAgain) {
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof userId === "undefined") {
        throw new AppwriteException('Missing required parameter: "userId"');
      }
      if (typeof secret === "undefined") {
        throw new AppwriteException('Missing required parameter: "secret"');
      }
      if (typeof password === "undefined") {
        throw new AppwriteException('Missing required parameter: "password"');
      }
      if (typeof passwordAgain === "undefined") {
        throw new AppwriteException('Missing required parameter: "passwordAgain"');
      }
      const apiPath = "/account/recovery";
      const payload = {};
      if (typeof userId !== "undefined") {
        payload["userId"] = userId;
      }
      if (typeof secret !== "undefined") {
        payload["secret"] = secret;
      }
      if (typeof password !== "undefined") {
        payload["password"] = password;
      }
      if (typeof passwordAgain !== "undefined") {
        payload["passwordAgain"] = passwordAgain;
      }
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("put", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * List sessions
   *
   * Get the list of active sessions across different devices for the currently
   * logged in user.
   *
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  listSessions() {
    return __awaiter(this, void 0, void 0, function* () {
      const apiPath = "/account/sessions";
      const payload = {};
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("get", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Delete sessions
   *
   * Delete all sessions from the user account and remove any sessions cookies
   * from the end client.
   *
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  deleteSessions() {
    return __awaiter(this, void 0, void 0, function* () {
      const apiPath = "/account/sessions";
      const payload = {};
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("delete", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Create anonymous session
   *
   * Use this endpoint to allow a new user to register an anonymous account in
   * your project. This route will also create a new session for the user. To
   * allow the new user to convert an anonymous account to a normal account, you
   * need to update its [email and
   * password](https://appwrite.io/docs/references/cloud/client-web/account#updateEmail)
   * or create an [OAuth2
   * session](https://appwrite.io/docs/references/cloud/client-web/account#CreateOAuth2Session).
   *
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  createAnonymousSession() {
    return __awaiter(this, void 0, void 0, function* () {
      const apiPath = "/account/sessions/anonymous";
      const payload = {};
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("post", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Create email session
   *
   * Allow the user to login into their account by providing a valid email and
   * password combination. This route will create a new session for the user.
   *
   * A user is limited to 10 active sessions at a time by default. [Learn more
   * about session
   * limits](https://appwrite.io/docs/authentication-security#limits).
   *
   * @param {string} email
   * @param {string} password
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  createEmailSession(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof email === "undefined") {
        throw new AppwriteException('Missing required parameter: "email"');
      }
      if (typeof password === "undefined") {
        throw new AppwriteException('Missing required parameter: "password"');
      }
      const apiPath = "/account/sessions/email";
      const payload = {};
      if (typeof email !== "undefined") {
        payload["email"] = email;
      }
      if (typeof password !== "undefined") {
        payload["password"] = password;
      }
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("post", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Create magic URL session
   *
   * Sends the user an email with a secret key for creating a session. If the
   * provided user ID has not been registered, a new user will be created. When
   * the user clicks the link in the email, the user is redirected back to the
   * URL you provided with the secret key and userId values attached to the URL
   * query string. Use the query string parameters to submit a request to the
   * [PUT
   * /account/sessions/magic-url](https://appwrite.io/docs/references/cloud/client-web/account#updateMagicURLSession)
   * endpoint to complete the login process. The link sent to the user's email
   * address is valid for 1 hour. If you are on a mobile device you can leave
   * the URL parameter empty, so that the login completion will be handled by
   * your Appwrite instance by default.
   *
   * A user is limited to 10 active sessions at a time by default. [Learn more
   * about session
   * limits](https://appwrite.io/docs/authentication-security#limits).
   *
   *
   * @param {string} userId
   * @param {string} email
   * @param {string} url
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  createMagicURLSession(userId, email, url) {
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof userId === "undefined") {
        throw new AppwriteException('Missing required parameter: "userId"');
      }
      if (typeof email === "undefined") {
        throw new AppwriteException('Missing required parameter: "email"');
      }
      const apiPath = "/account/sessions/magic-url";
      const payload = {};
      if (typeof userId !== "undefined") {
        payload["userId"] = userId;
      }
      if (typeof email !== "undefined") {
        payload["email"] = email;
      }
      if (typeof url !== "undefined") {
        payload["url"] = url;
      }
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("post", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Create magic URL session (confirmation)
   *
   * Use this endpoint to complete creating the session with the Magic URL. Both
   * the **userId** and **secret** arguments will be passed as query parameters
   * to the redirect URL you have provided when sending your request to the
   * [POST
   * /account/sessions/magic-url](https://appwrite.io/docs/references/cloud/client-web/account#createMagicURLSession)
   * endpoint.
   *
   * Please note that in order to avoid a [Redirect
   * Attack](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.md)
   * the only valid redirect URLs are the ones from domains you have set when
   * adding your platforms in the console interface.
   *
   * @param {string} userId
   * @param {string} secret
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  updateMagicURLSession(userId, secret) {
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof userId === "undefined") {
        throw new AppwriteException('Missing required parameter: "userId"');
      }
      if (typeof secret === "undefined") {
        throw new AppwriteException('Missing required parameter: "secret"');
      }
      const apiPath = "/account/sessions/magic-url";
      const payload = {};
      if (typeof userId !== "undefined") {
        payload["userId"] = userId;
      }
      if (typeof secret !== "undefined") {
        payload["secret"] = secret;
      }
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("put", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Create OAuth2 session
   *
   * Allow the user to login to their account using the OAuth2 provider of their
   * choice. Each OAuth2 provider should be enabled from the Appwrite console
   * first. Use the success and failure arguments to provide a redirect URL's
   * back to your app when login is completed.
   *
   * If there is already an active session, the new session will be attached to
   * the logged-in account. If there are no active sessions, the server will
   * attempt to look for a user with the same email address as the email
   * received from the OAuth2 provider and attach the new session to the
   * existing user. If no matching user is found - the server will create a new
   * user.
   *
   * A user is limited to 10 active sessions at a time by default. [Learn more
   * about session
   * limits](https://appwrite.io/docs/authentication-security#limits).
   *
   *
   * @param {string} provider
   * @param {string} success
   * @param {string} failure
   * @param {string[]} scopes
   * @throws {AppwriteException}
   * @returns {void|string}
  */
  createOAuth2Session(provider, success, failure, scopes) {
    if (typeof provider === "undefined") {
      throw new AppwriteException('Missing required parameter: "provider"');
    }
    const apiPath = "/account/sessions/oauth2/{provider}".replace("{provider}", provider);
    const payload = {};
    if (typeof success !== "undefined") {
      payload["success"] = success;
    }
    if (typeof failure !== "undefined") {
      payload["failure"] = failure;
    }
    if (typeof scopes !== "undefined") {
      payload["scopes"] = scopes;
    }
    const uri = new URL(this.client.config.endpoint + apiPath);
    payload["project"] = this.client.config.project;
    for (const [key, value] of Object.entries(Service.flatten(payload))) {
      uri.searchParams.append(key, value);
    }
    if (typeof self !== "undefined" && (self === null || self === void 0 ? void 0 : self.location)) {
      self.location.href = uri.toString();
    } else {
      return uri;
    }
  }
  /**
   * Create phone session
   *
   * Sends the user an SMS with a secret key for creating a session. If the
   * provided user ID has not be registered, a new user will be created. Use the
   * returned user ID and secret and submit a request to the [PUT
   * /account/sessions/phone](https://appwrite.io/docs/references/cloud/client-web/account#updatePhoneSession)
   * endpoint to complete the login process. The secret sent to the user's phone
   * is valid for 15 minutes.
   *
   * A user is limited to 10 active sessions at a time by default. [Learn more
   * about session
   * limits](https://appwrite.io/docs/authentication-security#limits).
   *
   * @param {string} userId
   * @param {string} phone
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  createPhoneSession(userId, phone) {
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof userId === "undefined") {
        throw new AppwriteException('Missing required parameter: "userId"');
      }
      if (typeof phone === "undefined") {
        throw new AppwriteException('Missing required parameter: "phone"');
      }
      const apiPath = "/account/sessions/phone";
      const payload = {};
      if (typeof userId !== "undefined") {
        payload["userId"] = userId;
      }
      if (typeof phone !== "undefined") {
        payload["phone"] = phone;
      }
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("post", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Create phone session (confirmation)
   *
   * Use this endpoint to complete creating a session with SMS. Use the
   * **userId** from the
   * [createPhoneSession](https://appwrite.io/docs/references/cloud/client-web/account#createPhoneSession)
   * endpoint and the **secret** received via SMS to successfully update and
   * confirm the phone session.
   *
   * @param {string} userId
   * @param {string} secret
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  updatePhoneSession(userId, secret) {
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof userId === "undefined") {
        throw new AppwriteException('Missing required parameter: "userId"');
      }
      if (typeof secret === "undefined") {
        throw new AppwriteException('Missing required parameter: "secret"');
      }
      const apiPath = "/account/sessions/phone";
      const payload = {};
      if (typeof userId !== "undefined") {
        payload["userId"] = userId;
      }
      if (typeof secret !== "undefined") {
        payload["secret"] = secret;
      }
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("put", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Get session
   *
   * Use this endpoint to get a logged in user's session using a Session ID.
   * Inputting 'current' will return the current session being used.
   *
   * @param {string} sessionId
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  getSession(sessionId) {
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof sessionId === "undefined") {
        throw new AppwriteException('Missing required parameter: "sessionId"');
      }
      const apiPath = "/account/sessions/{sessionId}".replace("{sessionId}", sessionId);
      const payload = {};
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("get", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Update OAuth session (refresh tokens)
   *
   * Access tokens have limited lifespan and expire to mitigate security risks.
   * If session was created using an OAuth provider, this route can be used to
   * "refresh" the access token.
   *
   * @param {string} sessionId
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  updateSession(sessionId) {
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof sessionId === "undefined") {
        throw new AppwriteException('Missing required parameter: "sessionId"');
      }
      const apiPath = "/account/sessions/{sessionId}".replace("{sessionId}", sessionId);
      const payload = {};
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("patch", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Delete session
   *
   * Logout the user. Use 'current' as the session ID to logout on this device,
   * use a session ID to logout on another device. If you're looking to logout
   * the user on all devices, use [Delete
   * Sessions](https://appwrite.io/docs/references/cloud/client-web/account#deleteSessions)
   * instead.
   *
   * @param {string} sessionId
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  deleteSession(sessionId) {
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof sessionId === "undefined") {
        throw new AppwriteException('Missing required parameter: "sessionId"');
      }
      const apiPath = "/account/sessions/{sessionId}".replace("{sessionId}", sessionId);
      const payload = {};
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("delete", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Update status
   *
   * Block the currently logged in user account. Behind the scene, the user
   * record is not deleted but permanently blocked from any access. To
   * completely delete a user, use the Users API instead.
   *
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  updateStatus() {
    return __awaiter(this, void 0, void 0, function* () {
      const apiPath = "/account/status";
      const payload = {};
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("patch", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Create email verification
   *
   * Use this endpoint to send a verification message to your user email address
   * to confirm they are the valid owners of that address. Both the **userId**
   * and **secret** arguments will be passed as query parameters to the URL you
   * have provided to be attached to the verification email. The provided URL
   * should redirect the user back to your app and allow you to complete the
   * verification process by verifying both the **userId** and **secret**
   * parameters. Learn more about how to [complete the verification
   * process](https://appwrite.io/docs/references/cloud/client-web/account#updateVerification).
   * The verification link sent to the user's email address is valid for 7 days.
   *
   * Please note that in order to avoid a [Redirect
   * Attack](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.md),
   * the only valid redirect URLs are the ones from domains you have set when
   * adding your platforms in the console interface.
   *
   *
   * @param {string} url
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  createVerification(url) {
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof url === "undefined") {
        throw new AppwriteException('Missing required parameter: "url"');
      }
      const apiPath = "/account/verification";
      const payload = {};
      if (typeof url !== "undefined") {
        payload["url"] = url;
      }
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("post", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Create email verification (confirmation)
   *
   * Use this endpoint to complete the user email verification process. Use both
   * the **userId** and **secret** parameters that were attached to your app URL
   * to verify the user email ownership. If confirmed this route will return a
   * 200 status code.
   *
   * @param {string} userId
   * @param {string} secret
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  updateVerification(userId, secret) {
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof userId === "undefined") {
        throw new AppwriteException('Missing required parameter: "userId"');
      }
      if (typeof secret === "undefined") {
        throw new AppwriteException('Missing required parameter: "secret"');
      }
      const apiPath = "/account/verification";
      const payload = {};
      if (typeof userId !== "undefined") {
        payload["userId"] = userId;
      }
      if (typeof secret !== "undefined") {
        payload["secret"] = secret;
      }
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("put", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Create phone verification
   *
   * Use this endpoint to send a verification SMS to the currently logged in
   * user. This endpoint is meant for use after updating a user's phone number
   * using the
   * [accountUpdatePhone](https://appwrite.io/docs/references/cloud/client-web/account#updatePhone)
   * endpoint. Learn more about how to [complete the verification
   * process](https://appwrite.io/docs/references/cloud/client-web/account#updatePhoneVerification).
   * The verification code sent to the user's phone number is valid for 15
   * minutes.
   *
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  createPhoneVerification() {
    return __awaiter(this, void 0, void 0, function* () {
      const apiPath = "/account/verification/phone";
      const payload = {};
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("post", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
  /**
   * Create phone verification (confirmation)
   *
   * Use this endpoint to complete the user phone verification process. Use the
   * **userId** and **secret** that were sent to your user's phone number to
   * verify the user email ownership. If confirmed this route will return a 200
   * status code.
   *
   * @param {string} userId
   * @param {string} secret
   * @throws {AppwriteException}
   * @returns {Promise}
  */
  updatePhoneVerification(userId, secret) {
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof userId === "undefined") {
        throw new AppwriteException('Missing required parameter: "userId"');
      }
      if (typeof secret === "undefined") {
        throw new AppwriteException('Missing required parameter: "secret"');
      }
      const apiPath = "/account/verification/phone";
      const payload = {};
      if (typeof userId !== "undefined") {
        payload["userId"] = userId;
      }
      if (typeof secret !== "undefined") {
        payload["secret"] = secret;
      }
      const uri = new URL(this.client.config.endpoint + apiPath);
      return yield this.client.call("put", uri, {
        "content-type": "application/json"
      }, payload);
    });
  }
};
var Permission = class {
};
Permission.read = (role) => {
  return `read("${role}")`;
};
Permission.write = (role) => {
  return `write("${role}")`;
};
Permission.create = (role) => {
  return `create("${role}")`;
};
Permission.update = (role) => {
  return `update("${role}")`;
};
Permission.delete = (role) => {
  return `delete("${role}")`;
};

// background.js
console.log("[background.js] Starting service worker...");
console.log("[background.js] Service worker loaded");
var ENV = {
  VITE_APPWRITE_ENDPOINT: "https://appwrite.the-tower-run-tracker.com/v1",
  VITE_APPWRITE_PROJECT_ID: "68190de700097b8f59df",
  VITE_APP_URL: "http://localhost:3000"
};
var client = new Client();
client.setEndpoint(ENV.VITE_APPWRITE_ENDPOINT).setProject(ENV.VITE_APPWRITE_PROJECT_ID);
var account = new Account(client);
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message && message.type === "LOGIN_WITH_DISCORD") {
    console.log("[background.js] LOGIN_WITH_DISCORD received");
    const extensionId = chrome.runtime.id;
    const redirectUri = `chrome-extension://${extensionId}/oauth2`;
    console.log("[background.js] Using redirectUri:", redirectUri);
    const authUrl = `${ENV.VITE_APPWRITE_ENDPOINT.replace(/\/$/, "")}/account/sessions/oauth2/discord?project=${ENV.VITE_APPWRITE_PROJECT_ID}&success=${encodeURIComponent(redirectUri)}&failure=${encodeURIComponent(redirectUri)}`;
    console.log("[background.js] Launching WebAuthFlow:", authUrl);
    chrome.identity.launchWebAuthFlow({
      url: authUrl,
      interactive: true
    }, async (responseUrl) => {
      if (chrome.runtime.lastError) {
        console.error("[background.js] WebAuthFlow error:", chrome.runtime.lastError.message);
        sendResponse({ success: false, error: chrome.runtime.lastError.message });
        return;
      }
      if (!responseUrl) {
        console.error("[background.js] WebAuthFlow: No responseUrl returned (user may have closed window)");
        sendResponse({ success: false, error: "No response from OAuth window." });
        return;
      }
      console.log("[background.js] WebAuthFlow completed, responseUrl:", responseUrl);
      try {
        const user = await account.get();
        console.log("[background.js] Appwrite session established, user:", user);
        sendResponse({ success: true, user });
      } catch (err) {
        console.error("[background.js] Appwrite session error:", err);
        sendResponse({ success: false, error: err.message || String(err) });
      }
    });
    return true;
  }
  if (message && message.type === "GET_SESSION_USER") {
    account.get().then((user) => {
      sendResponse({ success: true, user });
    }).catch((err) => {
      sendResponse({ success: false, error: err.message || String(err) });
    });
    return true;
  }
});
//# sourceMappingURL=background.js.map
