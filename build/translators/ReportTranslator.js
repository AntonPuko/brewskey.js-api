"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.CADENCE_MAP = void 0;

var _DefaultTranslator2 = _interopRequireDefault(require("./DefaultTranslator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var CADENCE_MAP = {
  Biweekly: 3,
  Daily: 1,
  Monthly: 4,
  OneTime: 0,
  Weekly: 2
}; // todo clean the translator when we will be merging loadObject to master

exports.CADENCE_MAP = CADENCE_MAP;

var ReportTranslator =
/*#__PURE__*/
function (_DefaultTranslator) {
  _inherits(ReportTranslator, _DefaultTranslator);

  function ReportTranslator() {
    _classCallCheck(this, ReportTranslator);

    return _possibleConstructorReturn(this, _getPrototypeOf(ReportTranslator).apply(this, arguments));
  }

  _createClass(ReportTranslator, [{
    key: "toApi",
    value: function toApi(_ref) {
      var devices = _ref.devices,
          locations = _ref.locations,
          sendToEmails = _ref.sendToEmails,
          taps = _ref.taps,
          props = _objectWithoutProperties(_ref, ["devices", "locations", "sendToEmails", "taps"]);

      return _objectSpread({}, props, {
        deviceIds: devices ? devices.map(function (_ref2) {
          var id = _ref2.id;
          return id;
        }) : [],
        locationIds: locations ? locations.map(function (_ref3) {
          var id = _ref3.id;
          return id;
        }) : [],
        sendToEmails: sendToEmails.map(function (_ref4) {
          var email = _ref4.email;
          return email;
        }),
        tapIds: taps ? taps.map(function (_ref5) {
          var id = _ref5.id;
          return id;
        }) : []
      });
    }
  }, {
    key: "toForm",
    value: function toForm(report) {
      return _objectSpread({}, report, {
        reportCadence: CADENCE_MAP[report.reportCadence],
        sendToEmails: report.sendToEmails.map(function (email) {
          return {
            email: email
          };
        })
      });
    }
  }]);

  return ReportTranslator;
}(_DefaultTranslator2.default);

var _default = ReportTranslator;
exports.default = _default;