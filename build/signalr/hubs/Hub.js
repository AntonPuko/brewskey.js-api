"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactNativeSignalr = _interopRequireDefault(require("react-native-signalr"));

var _Config = _interopRequireDefault(require("../../Config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var PING_INTERVAL = 60000;

var Hub =
/*#__PURE__*/
function () {
  _createClass(Hub, null, [{
    key: "initNewConnection",
    value: function initNewConnection(rootPath) {
      return rootPath ? _reactNativeSignalr.default.hubConnection(rootPath) : _reactNativeSignalr.default.hubConnection();
    }
  }, {
    key: "getConnection",
    value: function getConnection(rootPath, shareConnection) {
      if (!shareConnection) {
        return Hub.initNewConnection(rootPath);
      }

      var connection = Hub.CONNECTIONS[rootPath];

      if (!connection) {
        connection = Hub.initNewConnection(rootPath);
        Hub.CONNECTIONS[rootPath] = connection;
      }

      return connection;
    }
  }]);

  function Hub(name) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$logging = _ref.logging,
        logging = _ref$logging === void 0 ? false : _ref$logging,
        queryParams = _ref.queryParams,
        _ref$rootPath = _ref.rootPath,
        rootPath = _ref$rootPath === void 0 ? 'https://brewskey.com' : _ref$rootPath,
        _ref$shareConnection = _ref.shareConnection,
        shareConnection = _ref$shareConnection === void 0 ? true : _ref$shareConnection,
        transport = _ref.transport;

    _classCallCheck(this, Hub);

    _defineProperty(this, "_connection", void 0);

    _defineProperty(this, "_connectionPromise", void 0);

    _defineProperty(this, "_proxy", void 0);

    _defineProperty(this, "_transport", void 0);

    this._connection = Hub.getConnection(rootPath, shareConnection);
    this._proxy = this._connection.createHubProxy(name);
    this._connection.logging = logging;
    this._connection.qs = queryParams;
    this._transport = transport;
  }

  _createClass(Hub, [{
    key: "connect",
    value: function connect() {
      var _connection = this._connection,
          _transport = this._transport;
      _connection.qs = _objectSpread({}, _connection.qs || {}, {
        access_token: _Config.default.token
      });
      this._connectionPromise = _transport ? _connection.start({
        pingInterval: PING_INTERVAL,
        transport: _transport
      }) : _connection.start({
        pingInterval: PING_INTERVAL
      });
      return this._connectionPromise;
    }
  }, {
    key: "disconnect",
    value: function disconnect() {
      this._connection.stop();
    }
  }, {
    key: "serverMethod",
    value: function serverMethod(name) {
      var _this = this;

      return function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _this._connectionPromise && _this._connectionPromise.then(function () {
          var _this$_proxy;

          return (_this$_proxy = _this._proxy).invoke.apply(_this$_proxy, [name].concat(args));
        });
      };
    }
  }, {
    key: "registerListener",
    value: function registerListener(name, listener) {
      this._proxy.on(name, listener);
    }
  }, {
    key: "unregisterListener",
    value: function unregisterListener(name, listener) {
      this._proxy.off(name, listener);
    }
  }, {
    key: "registerErrorHandler",
    value: function registerErrorHandler(handler) {
      this._connection.error(handler);
    }
  }]);

  return Hub;
}();

_defineProperty(Hub, "CONNECTIONS", {});

var _default = Hub;
exports.default = _default;