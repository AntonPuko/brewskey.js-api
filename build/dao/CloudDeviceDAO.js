"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _RestDAO2 = _interopRequireDefault(require("./RestDAO"));

var _CloudSSEManager = _interopRequireDefault(require("../CloudSSEManager"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DEVICE_ONLINE_STATUS_EVENT_NAME = 'spark/status';

var CloudDeviceDAO =
/*#__PURE__*/
function (_RestDAO) {
  _inherits(CloudDeviceDAO, _RestDAO);

  function CloudDeviceDAO() {
    var _this;

    _classCallCheck(this, CloudDeviceDAO);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CloudDeviceDAO).call(this, {
      entityName: 'cloud-devices'
    }));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_isOnlineStatusListenerToggled", false);

    return _this;
  }

  _createClass(CloudDeviceDAO, [{
    key: "getOne",
    value: function getOne(particleId) {
      return this.__getOne("api/v2/cloud-devices/".concat(particleId, "/"), particleId, {
        reformatError: function reformatError(error) {
          return error.error;
        }
      });
    }
  }, {
    key: "flash",
    value: function flash(particleId, file) {
      return this.__fetchOne("api/v2/cloud-devices/".concat(particleId, "/flash/"), {
        body: JSON.stringify({
          file: file,
          particleId: particleId
        }),
        headers: [{
          name: 'Accept',
          value: 'application/json'
        }, {
          name: 'Content-Type',
          value: 'application/json'
        }],
        method: 'PUT',
        reformatError: function reformatError(error) {
          return error.error;
        }
      });
    }
  }, {
    key: "startOnlineStatusListener",
    value: function startOnlineStatusListener() {
      if (this._isOnlineStatusListenerToggled) {
        return;
      }

      _CloudSSEManager.default.subscribe(this._onNewCloudSystemEvent, {
        eventNamePrefix: 'spark'
      });
    }
  }, {
    key: "stopOnlineStatusListener",
    value: function stopOnlineStatusListener() {
      _CloudSSEManager.default.unsubscribe(this._onNewCloudSystemEvent);
    }
  }, {
    key: "toggleOnlineStatusListener",
    value: function toggleOnlineStatusListener() {
      if (!this._isOnlineStatusListenerToggled) {
        this.startOnlineStatusListener();
      } else {
        this.stopOnlineStatusListener();
      }
    }
  }, {
    key: "_onNewCloudSystemEvent",
    value: function _onNewCloudSystemEvent(cloudEvent) {
      var data = cloudEvent.data,
          name = cloudEvent.name,
          particleId = cloudEvent.particleId;

      if (name !== DEVICE_ONLINE_STATUS_EVENT_NAME) {
        return;
      }

      var loader = this._entityLoaderById.get(particleId);

      if (!loader) {
        return;
      }

      this._entityLoaderById.set(particleId, loader.map(function (cloudDevice) {
        return _objectSpread({}, cloudDevice, {
          connected: data === 'online'
        });
      }));

      this.__emitChanges();
    }
  }]);

  return CloudDeviceDAO;
}(_RestDAO2.default);

var _default = new CloudDeviceDAO();

exports.default = _default;