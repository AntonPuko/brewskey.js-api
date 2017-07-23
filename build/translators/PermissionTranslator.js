'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _DefaultTranslator2 = require('./DefaultTranslator');

var _DefaultTranslator3 = _interopRequireDefault(_DefaultTranslator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PermissionTranslator = function (_DefaultTranslator) {
  _inherits(PermissionTranslator, _DefaultTranslator);

  function PermissionTranslator() {
    _classCallCheck(this, PermissionTranslator);

    return _possibleConstructorReturn(this, (PermissionTranslator.__proto__ || Object.getPrototypeOf(PermissionTranslator)).apply(this, arguments));
  }

  _createClass(PermissionTranslator, [{
    key: 'toApi',
    value: function toApi(_ref) {
      var entity = _ref.entity,
          entityType = _ref.entityType,
          user = _ref.user,
          organization = _ref.organization,
          props = _objectWithoutProperties(_ref, ['entity', 'entityType', 'user', 'organization']);

      return _extends({}, props, {
        deviceId: entityType === 'devices' ? entity.id : null,
        locationId: entityType === 'locations' ? entity.id : null,
        organizationId: entityType === 'organizations' ? entity.id : null,
        tapId: entityType === 'taps' ? entity.id : null,
        userId: user.id
      });
    }
  }]);

  return PermissionTranslator;
}(_DefaultTranslator3.default);

exports.default = PermissionTranslator;